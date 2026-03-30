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
  sendResetMailDeliveryPerson,
  sendVerifyMailDeliveryPerson,
} from "../config/mail.js";
import { STATUS } from "../enum/Status.js";

const DeliveryPerson = model.DeliveryPerson;
const DeliveryPersonDocument = model.DeliveryPersonDocument;

export const registerDeliveryPerson = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { firstname, lastname, email, phoneNumber, password } = req.body;
    const userPicture = req.files?.userPicture?.[0]?.filename;
    const userDocument = req.files?.userDocument?.[0]?.filename;

    if (!firstname || !lastname || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const existingDeliveryPerson = await DeliveryPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (existingDeliveryPerson) {
      return res
        .status(409)
        .json(clientErrorResponse("Email is already registered."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    const deliveryPerson = await DeliveryPerson.create({
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
    },{ transaction });

    await DeliveryPersonDocument.create({
      deliveryPersonId: deliveryPerson.id,
      userPicture: userPicture,
      userDocument: userDocument,
    },{ transaction });

    await transaction.commit();

    sendVerifyMailDeliveryPerson(normalizedEmail, verifyToken);

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

export const loginDeliveryPerson = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("Email and password are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const deliveryPerson = await DeliveryPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (!deliveryPerson) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }
 
    const isMatch = await bcrypt.compare(password, deliveryPerson.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    if (!deliveryPerson.isVerified) {
      return res
        .status(403)
        .json(
          clientErrorResponse("Please verify your email before logging in."),
        );
    }

    if (deliveryPerson.status == STATUS.PENDING) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account is pending admin verification. Please wait for approval.",
          ),
        );
    }

    if (deliveryPerson.status == STATUS.REJECTED) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account verification was rejected by the administrator.",
          ),
        );
    }

    if (!deliveryPerson.isActive) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account is blocked. Please contact the administrator.",
          ),
        );
    }

    const token = jwt.sign(
      { id: deliveryPerson.id, role: ROLE.DELIVERY_PERSON },
      process.env.JWT_SECRET_DELIVERY_PERSON,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json(successResponse("Login successful.", token));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyDeliveryPerson = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json(clientErrorResponse("Verification token is required."));
    }

    const deliveryPerson = await DeliveryPerson.findOne({
      where: { verifyToken: token },
    });

    if (!deliveryPerson) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid verification token."));
    }

    if (deliveryPerson.isVerified) {
      return res
        .status(400)
        .json(clientErrorResponse("Account is already verified."));
    }

    if (!isTokenValid(deliveryPerson.verifyTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Verification token has expired."));
    }

    deliveryPerson.verifyToken = null;
    deliveryPerson.verifyTokenExpires = null;
    deliveryPerson.isVerified = true;
    deliveryPerson.status = STATUS.APPROVED;

    await deliveryPerson.save();

    return res
      .status(200)
      .json(successResponse("Email verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const sendVerifyTokenDeliveryPerson = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const deliveryPerson = await DeliveryPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (!deliveryPerson || deliveryPerson.isVerified) {
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

    deliveryPerson.verifyToken = verifyToken;
    deliveryPerson.verifyTokenExpires = new Date(Date.now() + expiresIn);

    await deliveryPerson.save();

    sendVerifyMailDeliveryPerson(normalizedEmail, verifyToken);

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

export const resetPasswordDeliveryPerson = async (req, res) => {
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

    const deliveryPerson = await DeliveryPerson.findOne({
      where: { resetPasswordToken: token },
    });

    if (!deliveryPerson) {
      return res.status(401).json(clientErrorResponse("Invalid reset token."));
    }

    if (!isTokenValid(deliveryPerson.resetPasswordTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Reset token has expired."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    deliveryPerson.password = hashedPassword;
    deliveryPerson.resetPasswordToken = null;
    deliveryPerson.resetPasswordTokenExpires = null;

    await deliveryPerson.save();

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

export const sendResetPasswordTokenDeliveryPerson = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const deliveryPerson = await DeliveryPerson.findOne({
      where: { email: normalizedEmail },
    });

    if (!deliveryPerson) {
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

    deliveryPerson.resetPasswordToken = resetPasswordToken;
    deliveryPerson.resetPasswordTokenExpires = new Date(Date.now() + expiresIn);

    await deliveryPerson.save();

    sendResetMailDeliveryPerson(normalizedEmail, resetPasswordToken);

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

export const updateDocumentDeliveryPerson = async (req, res) => {
  try {
    const id = Number(req.id);
    const userPicture = req.files?.userPicture?.[0]?.filename;
    const userDocument = req.files?.userDocument?.[0]?.filename;

    if (!id) {
      return res
        .status(401)
        .json(clientErrorResponse("Unauthorized. User ID not found."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(id);

    if (!deliveryPerson) {
      return res.status(404).json(clientErrorResponse("Delivery person not found."));
    }

    const deliveryPersonDocument = await DeliveryPersonDocument.findOne({
      where: { deliveryPersonId: id },
    });

    if (!deliveryPersonDocument) {
      return res.status(404).json(clientErrorResponse("Document record not found."));
    }

    if (userPicture) {
      deliveryPersonDocument.userPicture = userPicture;
      deliveryPersonDocument.userPictureStatus = STATUS.PENDING;
      deliveryPersonDocument.userPictureReason = null;
    }

    if (userDocument) {
      deliveryPersonDocument.userDocument = userDocument;
      deliveryPersonDocument.userDocumentStatus = STATUS.PENDING;
      deliveryPersonDocument.userDocumentReason = null;
    }

    await deliveryPersonDocument.save();

    return res
      .status(200)
      .json(
        successResponse(
          "Documents uploaded successfully."
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
