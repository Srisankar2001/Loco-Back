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
  sendResetMailRestaurant,
  sendVerifyMailRestaurant,
} from "../config/mail.js";
import { STATUS } from "../enum/Status.js";

const Restaurant = model.Restaurant;
const RestaurantDocument = model.RestaurantDocument;

export const registerRestaurant = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { name, address, email, phoneNumber, password, locationLongitude , locationLatitude } = req.body;
    const image = req.files?.image?.[0]?.filename;
    const userPicture = req.files?.userPicture?.[0]?.filename;
    const userDocument = req.files?.userDocument?.[0]?.filename;
    const restaurantDocument = req.files?.restaurantDocument?.[0]?.filename;

    if (!name || !address || !email || !phoneNumber || !password || !locationLongitude || !locationLatitude) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const existingRestaurant = await Restaurant.findOne({
      where: { email: normalizedEmail },
    });

    if (existingRestaurant) {
      return res
        .status(409)
        .json(clientErrorResponse("Email is already registered."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    const restaurant = await Restaurant.create({
      name: name,
      address: address,
      image: image,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
      locationLatitude:locationLatitude,
      locationLongitude:locationLongitude,
      verifyToken,
      verifyTokenExpires: new Date(Date.now() + expiresIn),
      isVerified: false,
      isActive: false,
      status: STATUS.PENDING,
    },{transaction});

    await RestaurantDocument.create({
      restaurantId: restaurant.id,
      userPicture: userPicture,
      userDocument: userDocument,
      restaurantDocument: restaurantDocument,
    },{transaction});

     await transaction.commit(); 
     
    sendVerifyMailRestaurant(normalizedEmail, verifyToken);

    return res
      .status(201)
      .json(
        successResponse(
          "Account created successfully. Please verify your email.",
        ),
      );
  } catch (error) {
    await transaction.rollback();
    console.log(error)
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(clientErrorResponse("Email and password are required."));
    }

    const normalizedEmail = email.toLowerCase();

    const restaurant = await Restaurant.findOne({
      where: { email: normalizedEmail },
    });

    if (!restaurant) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid email or password."));
    }

    if (!restaurant.isVerified) {
      return res
        .status(403)
        .json(
          clientErrorResponse("Please verify your email before logging in."),
        );
    }

    if (restaurant.status == STATUS.PENDING) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account is pending admin verification. Please wait for approval.",
          ),
        );
    }

    if (restaurant.status == STATUS.REJECTED) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account verification was rejected by the administrator.",
          ),
        );
    }

    if (!restaurant.isActive) {
      return res
        .status(403)
        .json(
          clientErrorResponse(
            "Your account is blocked. Please contact the administrator.",
          ),
        );
    }

    const token = jwt.sign(
      { id: restaurant.id, role: ROLE.RESTAURANT },
      process.env.JWT_SECRET_RESTAURANT,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json(successResponse("Login successful.", token));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyRestaurant = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json(clientErrorResponse("Verification token is required."));
    }

    const restaurant = await Restaurant.findOne({
      where: { verifyToken: token },
    });

    if (!restaurant) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid verification token."));
    }

    if (restaurant.isVerified) {
      return res
        .status(400)
        .json(clientErrorResponse("Account is already verified."));
    }

    if (!isTokenValid(restaurant.verifyTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Verification token has expired."));
    }

    restaurant.verifyToken = null;
    restaurant.verifyTokenExpires = null;
    restaurant.isVerified = true;
    restaurant.status = STATUS.APPROVED

    await restaurant.save();

    return res
      .status(200)
      .json(successResponse("Email verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const sendVerifyTokenRestaurant = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const restaurant = await Restaurant.findOne({
      where: { email: normalizedEmail },
    });

    if (!restaurant || restaurant.isVerified) {
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

    restaurant.verifyToken = verifyToken;
    restaurant.verifyTokenExpires = new Date(Date.now() + expiresIn);

    await restaurant.save();

    sendVerifyMailRestaurant(normalizedEmail, verifyToken);

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

export const resetPasswordRestaurant = async (req, res) => {
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

    const restaurant = await Restaurant.findOne({
      where: { resetPasswordToken: token },
    });

    if (!restaurant) {
      return res.status(401).json(clientErrorResponse("Invalid reset token."));
    }

    if (!isTokenValid(restaurant.resetPasswordTokenExpires)) {
      return res
        .status(410)
        .json(clientErrorResponse("Reset token has expired."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    restaurant.password = hashedPassword;
    restaurant.resetPasswordToken = null;
    restaurant.resetPasswordTokenExpires = null;

    await restaurant.save();

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

export const sendResetPasswordTokenRestaurant = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(clientErrorResponse("Email address is required."));
    }

    const normalizedEmail = email.toLowerCase();

    const restaurant = await Restaurant.findOne({
      where: { email: normalizedEmail },
    });

    if (!restaurant) {
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

    restaurant.resetPasswordToken = resetPasswordToken;
    restaurant.resetPasswordTokenExpires = new Date(Date.now() + expiresIn);

    await restaurant.save();

    sendResetMailRestaurant(normalizedEmail, resetPasswordToken);

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

export const updateDocumentRestaurant = async (req, res) => {
  try {
    const id = Number(req.id);
    const userPicture = req.files?.userPicture?.[0]?.filename;
    const userDocument = req.files?.userDocument?.[0]?.filename;
    const restaurantDocument = req.files?.restaurantDocument?.[0]?.filename;

    if (!id) {
      return res
        .status(401)
        .json(clientErrorResponse("Unauthorized. User ID not found."));
    }

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json(clientErrorResponse("Restaurant not found."));
    }

    const restaurantDocumentEntity = await RestaurantDocument.findOne({
      where: { restaurantId: id },
    });

    if (!restaurantDocumentEntity) {
      return res
        .status(404)
        .json(clientErrorResponse("Document record not found."));
    }

    if (userPicture) {
      restaurantDocumentEntity.userPicture = userPicture;
      restaurantDocumentEntity.userPictureStatus = STATUS.PENDING;
      restaurantDocumentEntity.userPictureReason = null;
    }

    if (userDocument) {
      restaurantDocumentEntity.userDocument = userDocument;
      restaurantDocumentEntity.userDocumentStatus = STATUS.PENDING;
      restaurantDocumentEntity.userDocumentReason = null;
    }

    if (restaurantDocument) {
      restaurantDocumentEntity.restaurantDocument = restaurantDocument;
      restaurantDocumentEntity.restaurantDocumentStatus = STATUS.PENDING;
      restaurantDocumentEntity.restaurantDocumentReason = null;
    }

    await restaurantDocumentEntity.save();

    return res
      .status(200)
      .json(successResponse("Documents uploaded successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
