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
import { sendResetMailUser, sendVerifyMailUser } from "../config/mail.js";

const User = model.User

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phoneNumber, password } = req.body;

    if (!firstname || !lastname || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res
        .status(409)
        .json(clientErrorResponse("Email is already registered."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    await User.create({
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

    sendVerifyMailUser(normalizedEmail,verifyToken)

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("Email and password are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json(
          clientErrorResponse("Please verify your email before logging in."),
        );
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json(
          clientErrorResponse("Your account is blocked. Please contact the administrator."),
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    const token = jwt.sign(
      { id: user.id, role: ROLE.USER },
      process.env.JWT_SECRET_USER,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json(successResponse("Login successful.", token));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json(clientErrorResponse("Verification token is required."));
    }

    const user = await User.findOne({
      where: { verifyToken: token },
    });

    if (!user) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid verification token."));
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json(clientErrorResponse("Account is already verified."));
    }

    if (!isTokenValid(user.verifyTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Verification token has expired."));
    }

    user.verifyToken = null;
    user.verifyTokenExpires = null;
    user.isVerified = true;

    await user.save();

    return res
      .status(200)
      .json(successResponse("Email verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const sendVerifyTokenUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (!user || user.isVerified) {
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

    user.verifyToken = verifyToken;
    user.verifyTokenExpires = new Date(Date.now() + expiresIn);

    await user.save();

    sendVerifyMailUser(normalizedEmail,verifyToken)

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

export const resetPasswordUser = async (req, res) => {
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

    const user = await User.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      return res.status(401).json(clientErrorResponse("Invalid reset token."));
    }

    if (!isTokenValid(user.resetPasswordTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Reset token has expired."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;

    await user.save();

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

export const sendResetPasswordTokenUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const user= await User.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
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

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpires = new Date(Date.now() + expiresIn);

    await user.save();

    sendResetMailUser(normalizedEmail,resetPasswordToken)

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