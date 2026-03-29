import db from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";
import { isTokenValid } from "../utils/tokenUtil.js";
import { ROLE } from "../enum/Role.js";
import {
  sendResetMailPickupPerson,
  sendVerifyMailPickupPerson,
} from "../config/mail.js";
import { STATUS } from "../enum/Status.js";

const PickupPerson = model.PickupPerson;
const PickupPersonDocument = model.PickupPersonDocument;

export const registerPickupPerson = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { firstname, lastname, email, phoneNumber, password } = req.body;
    const userPicture = req.files?.userPicture?.[0]?.filename;
    const userDocument = req.files?.userDocument?.[0]?.filename;
    const vehiclePicture = req.files?.vehiclePicture?.[0]?.filename;
    const vehicleDocument = req.files?.vehicleDocument?.[0]?.filename;

    if (!firstname || !lastname || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const existingPickupPerson = await PickupPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (existingPickupPerson) {
      return res
        .status(409)
        .json(clientErrorResponse("Email is already registered."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    const pickupPerson = await PickupPerson.create({
      firstname,
      lastname,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpires: new Date(Date.now() + expiresIn),
      isVerified: false,
      isActive: false,
      status: STATUS.PENDING,
    },{transaction});

    await PickupPersonDocument.create({
      pickupPersonId: pickupPerson.id,
      userPicture: userPicture,
      userDocument: userDocument,
      vehiclePicture: vehiclePicture,
      vehicleDocument: vehicleDocument,
    },{transaction});

     await transaction.commit(); 
     
    sendVerifyMailPickupPerson(normalizedEmail, verifyToken);

    return res
      .status(201)
      .json(
        successResponse(
          "Account created successfully. Please verify your email.",
        ),
      );
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const loginPickupPerson = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("Email and password are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const pickupPerson = await PickupPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (!pickupPerson) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    const isMatch = await bcrypt.compare(password, pickupPerson.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    if (!pickupPerson.isVerified) {
      return res
        .status(403)
        .json(
          clientErrorResponse("Please verify your email before logging in."),
        );
    }

    if (pickupPerson.status == STATUS.PENDING) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account is pending admin verification. Please wait for approval.",
          ),
        );
    }

    if (pickupPerson.status == STATUS.REJECTED) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account verification was rejected by the administrator.",
          ),
        );
    }

    if (!pickupPerson.isActive) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account is blocked. Please contact the administrator.",
          ),
        );
    }

    const token = jwt.sign(
      { id: pickupPerson.id, role: ROLE.PICKUP_PERSON },
      process.env.JWT_SECRET_PICKUP_PERSON,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json(successResponse("Login successful.", token));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyPickupPerson = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json(clientErrorResponse("Verification token is required."));
    }

    const pickupPerson = await PickupPerson.findOne({
      where: { verifyToken: token },
    });

    if (!pickupPerson) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid verification token."));
    }

    if (pickupPerson.isVerified) {
      return res
        .status(400)
        .json(clientErrorResponse("Account is already verified."));
    }

    if (!isTokenValid(pickupPerson.verifyTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Verification token has expired."));
    }

    pickupPerson.verifyToken = null;
    pickupPerson.verifyTokenExpires = null;
    pickupPerson.isVerified = true;
    pickupPerson.status = STATUS.APPROVED

    await pickupPerson.save();

    return res
      .status(200)
      .json(successResponse("Email verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const sendVerifyTokenPickupPerson = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const pickupPerson = await PickupPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (!pickupPerson || pickupPerson.isVerified) {
      return res
        .status(200)
        .json(
          successResponse(
            "If an account exists, a verification link has been sent.",
          ),
        );
    }

    const verifyToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    pickupPerson.verifyToken = verifyToken;
    pickupPerson.verifyTokenExpires = new Date(Date.now() + expiresIn);

    await pickupPerson.save();

    sendVerifyMailPickupPerson(normalizedEmail, verifyToken);

    return res
      .status(200)
      .json(
        successResponse(
          "Verification link has been sent to your email address.",
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const resetPasswordPickupPerson = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res
        .status(400)
        .json(clientErrorResponse("Reset token is required."));
    }

    if (!password) {
      return res.status(400).json(clientErrorResponse("Password is required."));
    }

    const pickupPerson = await PickupPerson.findOne({
      where: { resetPasswordToken: token },
    });

    if (!pickupPerson) {
      return res.status(401).json(clientErrorResponse("Invalid reset token."));
    }

    if (!isTokenValid(pickupPerson.resetPasswordTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Reset token has expired."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    pickupPerson.password = hashedPassword;
    pickupPerson.resetPasswordToken = null;
    pickupPerson.resetPasswordTokenExpires = null;

    await pickupPerson.save();

    return res
      .status(200)
      .json(successResponse("Password has been reset successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(
        serverErrorResponse("Something went wrong. Please try again later."),
      );
  }
};

export const sendResetPasswordTokenPickupPerson = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const pickupPerson = await PickupPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (!pickupPerson) {
      return res
        .status(200)
        .json(
          successResponse(
            "If an account exists, a reset link has been sent to your email.",
          ),
        );
    }

    const resetPasswordToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.RESET_TOKEN_EXPIRES_IN) || 3600000;

    pickupPerson.resetPasswordToken = resetPasswordToken;
    pickupPerson.resetPasswordTokenExpires = new Date(Date.now() + expiresIn);

    await pickupPerson.save();

    sendResetMailPickupPerson(normalizedEmail, resetPasswordToken);

    return res
      .status(200)
      .json(
        successResponse(
          "If an account exists, a reset link has been sent to your email.",
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        serverErrorResponse("Something went wrong. Please try again later."),
      );
  }
};

export const updateDocumentPickupPerson = async (req, res) => {
  try {
    const id = Number(req.id);
    const userPicture = req.files?.userPicture?.[0]?.filename;
    const userDocument = req.files?.userDocument?.[0]?.filename;
    const vehiclePicture = req.files?.vehiclePicture?.[0]?.filename;
    const vehicleDocument = req.files?.vehicleDocument?.[0]?.filename;

    if (!id) {
      return res
        .status(401)
        .json(clientErrorResponse("Unauthorized. User ID not found."));
    }

    const pickupPerson = await PickupPerson.findByPk(id);

    if (!pickupPerson) {
      return res
        .status(404)
        .json(clientErrorResponse("Pickup person not found."));
    }

    const pickupPersonDocument = await PickupPersonDocument.findOne({
      where: { pickupPersonId: id },
    });

    if (!pickupPersonDocument) {
      return res
        .status(404)
        .json(clientErrorResponse("Document record not found."));
    }

    if (userPicture) {
      pickupPersonDocument.userPicture = userPicture;
      pickupPersonDocument.userPictureStatus = STATUS.PENDING;
      pickupPersonDocument.userPictureReason = null;
    }

    if (userDocument) {
      pickupPersonDocument.userDocument = userDocument;
      pickupPersonDocument.userDocumentStatus = STATUS.PENDING;
      pickupPersonDocument.userDocumentReason = null;
    }

    if (vehiclePicture) {
      pickupPersonDocument.vehiclePicture = vehiclePicture;
      pickupPersonDocument.vehiclePictureStatus = STATUS.PENDING;
      pickupPersonDocument.vehiclePictureReason = null;
    }

    if (vehicleDocument) {
      pickupPersonDocument.vehicleDocument = vehicleDocument;
      pickupPersonDocument.vehicleDocumentStatus = STATUS.PENDING;
      pickupPersonDocument.vehicleDocumentReason = null;
    }

    await pickupPersonDocument.save();

    return res
      .status(200)
      .json(successResponse("Documents uploaded successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
