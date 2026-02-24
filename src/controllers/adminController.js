import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";
import { isTokenValid } from "../utils/tokenUtil.js";
import { ROLE } from "../enum/Role.js";
import { sendResetMailAdmin, sendVerifyMailAdmin } from "../config/mail.js";

export const registerAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, phoneNumber, password } = req.body;

    if (!firstname || !lastname || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const existingAdmin = await Admin.findOne({
      where: { email: normalizedEmail },
    });

    if (existingAdmin) {
      return res
        .status(409)
        .json(clientErrorResponse("Email is already registered."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    await Admin.create({
      firstname,
      lastname,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpires: new Date(Date.now() + expiresIn),
      isVerified: false,
      isActive: true
    });

    sendVerifyMailAdmin(normalizedEmail,verifyToken)

    return res
      .status(201)
      .json(
        successResponse(
          "Account created successfully. Please verify your email.",
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("Email and password are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const admin = await Admin.findOne({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    if (!admin.isVerified) {
      return res
        .status(403)
        .json(
          clientErrorResponse("Please verify your email before logging in."),
        );
    }

    if (!admin.isActive) {
      return res
        .status(403)
        .json(
          clientErrorResponse("Your account is blocked. Please contact the administrator."),
        );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    const token = jwt.sign(
      { id: admin.id, role: ROLE.ADMIN },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json(successResponse("Login successful.", token));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyAdmin = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json(clientErrorResponse("Verification token is required."));
    }

    const admin = await Admin.findOne({
      where: { verifyToken: token },
    });

    if (!admin) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid verification token."));
    }

    if (admin.isVerified) {
      return res
        .status(400)
        .json(clientErrorResponse("Account is already verified."));
    }

    if (!isTokenValid(admin.verifyTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Verification token has expired."));
    }

    admin.verifyToken = null;
    admin.verifyTokenExpires = null;
    admin.isVerified = true;

    await admin.save();

    return res
      .status(200)
      .json(successResponse("Email verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const sendVerifyTokenAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const admin = await Admin.findOne({
      where: { email: normalizedEmail },
    });

    if (!admin || admin.isVerified) {
      return res
        .status(200)
        .json(
          successResponse(
            "If an account exists, a verification link has been sent.",
          ),
        );
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    admin.verifyToken = verifyToken;
    admin.verifyTokenExpires = new Date(Date.now() + expiresIn);

    await admin.save();

    sendVerifyMailAdmin(normalizedEmail,verifyToken)

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

export const resetPasswordAdmin = async (req, res) => {
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

    const admin = await Admin.findOne({
      where: { resetPasswordToken: token },
    });

    if (!admin) {
      return res.status(401).json(clientErrorResponse("Invalid reset token."));
    }

    if (!isTokenValid(admin.resetPasswordTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Reset token has expired."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;
    admin.resetPasswordToken = null;
    admin.resetPasswordTokenExpires = null;

    await admin.save();

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

export const sendResetPasswordTokenAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const admin = await Admin.findOne({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      return res
        .status(200)
        .json(
          successResponse(
            "If an account exists, a reset link has been sent to your email.",
          ),
        );
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");

    const expiresIn = Number(process.env.RESET_TOKEN_EXPIRES_IN) || 3600000;

    admin.resetPasswordToken = resetPasswordToken;
    admin.resetPasswordTokenExpires = new Date(Date.now() + expiresIn);

    await admin.save();

    sendResetMailAdmin(normalizedEmail,resetPasswordToken)

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

export const activateAdmin = async (req, res) => {
  try {
    const id = req.id
    const { adminId } = req.params;

    if (!adminId ) {
      return res
        .status(400)
        .json(clientErrorResponse("ID is required."));
    }

    if(id == adminId){
      return res
        .status(400)
        .json(clientErrorResponse("You can't activate your own account."));
    }

    const admin = await Admin.findByPk(Number(adminId));

    if (!admin) {
      return res
        .status(404)
        .json(clientErrorResponse("ID not found."));
    }

    if(admin.isActive){
      return res
        .status(400)
        .json(clientErrorResponse("Account is already active."));
    }

    admin.isActive = true;

    await admin.save()

    return res.status(200).json(successResponse("Account activated successful."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deactivateAdmin = async (req, res) => {
  try {
    const id = req.id
    const { adminId } = req.params;

    if (!adminId ) {
      return res
        .status(400)
        .json(clientErrorResponse("ID is required."));
    }

    if(id == adminId){
      return res
        .status(400)
        .json(clientErrorResponse("You can't deactivate your own account."));
    }

    const admin = await Admin.findByPk(Number(adminId));

    if (!admin) {
      return res
        .status(404)
        .json(clientErrorResponse("ID not found."));
    }

    if(!admin.isActive){
      return res
        .status(400)
        .json(clientErrorResponse("Account is already deactive."));
    }

    admin.isActive = false;

    await admin.save()

    return res.status(200).json(successResponse("Account deactivated successful."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
