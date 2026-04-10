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
import { sendResetMailAdmin, sendVerifyMailAdmin } from "../config/mail.js";
import { STATUS } from "../enum/Status.js";
import { Op } from "sequelize";

const Admin = model.Admin;
const User = model.User;
const PickupPerson = model.PickupPerson;
const DeliveryPerson = model.DeliveryPerson;
const Restaurant = model.Restaurant;
const PickupPersonDocument = model.PickupPersonDocument;
const DeliveryPersonDocument = model.DeliveryPersonDocument;
const RestaurantDocument = model.RestaurantDocument;

export const registerAdmin = async (req, res) => {
  try {
    const id = req.id;
    const { firstname, lastname, email, phoneNumber, password } = req.body;

    // if (!id) {
    //   return res
    //     .status(401)
    //     .json(clientErrorResponse("Unauthorized. User ID not found."));
    // }

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

    const verifyToken = crypto.randomBytes(8).toString("hex");

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
      isActive: true,
    });

    sendVerifyMailAdmin(normalizedEmail, verifyToken);

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

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
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
          clientErrorResponse(
            "Your account is blocked. Please contact the administrator.",
          ),
        );
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

    const verifyToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.VERIFY_TOKEN_EXPIRES_IN) || 43200000;

    admin.verifyToken = verifyToken;
    admin.verifyTokenExpires = new Date(Date.now() + expiresIn);

    await admin.save();

    sendVerifyMailAdmin(normalizedEmail, verifyToken);

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

    const resetPasswordToken = crypto.randomBytes(8).toString("hex");

    const expiresIn = Number(process.env.RESET_TOKEN_EXPIRES_IN) || 3600000;

    admin.resetPasswordToken = resetPasswordToken;
    admin.resetPasswordTokenExpires = new Date(Date.now() + expiresIn);

    await admin.save();

    sendResetMailAdmin(normalizedEmail, resetPasswordToken);

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

export const updateAdminStatus = async (req, res) => {
  try {
    const id = req.id;
    const  adminId = req.params.userId;
    const { isActive } = req.body;

    if (!adminId || isNaN(Number(adminId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid admin ID is required."));
    }

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json(clientErrorResponse("Active status must be true or false."));
    }

    if (Number(id) === Number(adminId)) {
      return res.status(400).json(
        clientErrorResponse("You cannot change your own account status.")
      );
    }

    const admin = await Admin.findByPk(Number(adminId));

    if (!admin) {
      return res
        .status(404)
        .json(clientErrorResponse("Admin not found."));
    }

    if (admin.isActive === isActive) {
      return res.status(400).json(
        clientErrorResponse(
          `Account is already ${isActive ? "active" : "inactive"}.`
        )
      );
    }

    admin.isActive = isActive;
    await admin.save();

    return res.status(200).json(
      successResponse(
        `Account ${isActive ? "activated" : "deactivated"} successfully.`
      )
    );

  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to update account status."));
  }
};

export const updateDeliveryPersonStatus = async (req, res) => {
  try {
    const id = req.id;
    const  deliveryPersonId = req.params.userId;
    const { isActive } = req.body;

    if (!deliveryPersonId || isNaN(Number(deliveryPersonId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid delivery person ID is required."));
    }

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json(clientErrorResponse("Active status must be true or false."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(Number(deliveryPersonId));

    if (!deliveryPerson) {
      return res
        .status(404)
        .json(clientErrorResponse("Delivery Person not found."));
    }

    if (deliveryPerson.isActive === isActive) {
      return res.status(400).json(
        clientErrorResponse(
          `Account is already ${isActive ? "active" : "inactive"}.`
        )
      );
    }

    deliveryPerson.isActive = isActive;
    await deliveryPerson.save();

    return res.status(200).json(
      successResponse(
        `Account ${isActive ? "activated" : "deactivated"} successfully.`
      )
    );

  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to update account status."));
  }
};

export const updatePickupPersonStatus = async (req, res) => {
  try {
    const id = req.id;
    const  pickupPersonId = req.params.userId;
    const { isActive } = req.body;

    if (!pickupPersonId || isNaN(Number(pickupPersonId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid pickup person ID is required."));
    }

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json(clientErrorResponse("Active status must be true or false."));
    }

    const pickupPerson = await PickupPerson.findByPk(Number(pickupPersonId));

    if (!pickupPerson) {
      return res
        .status(404)
        .json(clientErrorResponse("Pickup Person not found."));
    }

    if (pickupPerson.isActive === isActive) {
      return res.status(400).json(
        clientErrorResponse(
          `Account is already ${isActive ? "active" : "inactive"}.`
        )
      );
    }

    pickupPerson.isActive = isActive;
    await pickupPerson.save();

    return res.status(200).json(
      successResponse(
        `Account ${isActive ? "activated" : "deactivated"} successfully.`
      )
    );

  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to update account status."));
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const id = req.id;
    const  userId = req.params.userId;
    const { isActive } = req.body;

    if (!userId || isNaN(Number(userId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid user ID is required."));
    }

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json(clientErrorResponse("Active status must be true or false."));
    }

    const user = await User.findByPk(Number(userId));

    if (!user) {
      return res
        .status(404)
        .json(clientErrorResponse("User not found."));
    }

    if (user.isActive === isActive) {
      return res.status(400).json(
        clientErrorResponse(
          `Account is already ${isActive ? "active" : "inactive"}.`
        )
      );
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json(
      successResponse(
        `Account ${isActive ? "activated" : "deactivated"} successfully.`
      )
    );

  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to update account status."));
  }
};

export const updateRestaurantStatus = async (req, res) => {
  try {
    const id = req.id;
    const  restaurantId = req.params.userId;
    const { isActive } = req.body;

    if (!restaurantId || isNaN(Number(restaurantId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid restaurant ID is required."));
    }

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json(clientErrorResponse("Active status must be true or false."));
    }

    const restaurant = await Restaurant.findByPk(Number(restaurantId));

    if (!restaurant) {
      return res
        .status(404)
        .json(clientErrorResponse("Restaurant not found."));
    }

    if (restaurant.isActive === isActive) {
      return res.status(400).json(
        clientErrorResponse(
          `Account is already ${isActive ? "active" : "inactive"}.`
        )
      );
    }

    restaurant.isActive = isActive;
    await restaurant.save();

    return res.status(200).json(
      successResponse(
        `Account ${isActive ? "activated" : "deactivated"} successfully.`
      )
    );

  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to update account status."));
  }
};

export const verifyDeliveryPersonDocument = async (req, res) => {
  try {
    const deliveryPersonId = req.params.userId;
    const {
      userPictureStatus,
      userPictureReason,
      userDocumentStatus,
      userDocumentReason,
    } = req.body;

    if (!deliveryPersonId || isNaN(deliveryPersonId)) {
      return res.status(400).json(clientErrorResponse("ID is required."));
    }

    const allowedStatuses = Object.values(STATUS);

    if (
      (userPictureStatus && !allowedStatuses.includes(userPictureStatus)) ||
      (userDocumentStatus && !allowedStatuses.includes(userDocumentStatus))
    ) {
      return res.status(400).json(clientErrorResponse("Invalid status value."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(
      Number(deliveryPersonId),
    );

    if (!deliveryPerson) {
      return res.status(404).json(clientErrorResponse("ID not found."));
    }

    const deliveryPersonDocument = await DeliveryPersonDocument.findOne({
      where: { deliveryPersonId: Number(deliveryPersonId) },
    });

    if (!deliveryPersonDocument) {
      return res.status(404).json(clientErrorResponse("Document not found."));
    }

    if (userPictureStatus)
      deliveryPersonDocument.userPictureStatus = userPictureStatus;
    if (userPictureReason)
      deliveryPersonDocument.userPictureReason = userPictureReason;
    if (userDocumentStatus)
      deliveryPersonDocument.userDocumentStatus = userDocumentStatus;
    if (userDocumentReason)
      deliveryPersonDocument.userDocumentReason = userDocumentReason;

    if (
      deliveryPersonDocument.userPictureStatus === STATUS.APPROVED &&
      deliveryPersonDocument.userDocumentStatus === STATUS.APPROVED
    ) {
      deliveryPerson.status = STATUS.APPROVED;
    } else {
      deliveryPerson.status = STATUS.REJECTED;
    }

    await deliveryPerson.save();
    await deliveryPersonDocument.save();

    return res.status(200).json(successResponse("Verification successful."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyPickupPersonDocument = async (req, res) => {
  try {
    const pickupPersonId = req.params.userId;
    const {
      userPictureStatus,
      userPictureReason,
      userDocumentStatus,
      userDocumentReason,
      vehiclePictureStatus,
      vehiclePictureReason,
      vehicleDocumentStatus,
      vehicleDocumentReason,
    } = req.body;

    if (!pickupPersonId || isNaN(pickupPersonId)) {
      return res.status(400).json(clientErrorResponse("ID is required."));
    }

    const allowedStatuses = Object.values(STATUS);

    if (
      (userPictureStatus && !allowedStatuses.includes(userPictureStatus)) ||
      (userDocumentStatus && !allowedStatuses.includes(userDocumentStatus)) ||
      (vehiclePictureStatus &&
        !allowedStatuses.includes(vehiclePictureStatus)) ||
      (vehicleDocumentStatus &&
        !allowedStatuses.includes(vehicleDocumentStatus))
    ) {
      return res.status(400).json(clientErrorResponse("Invalid status value."));
    }

    const pickupPerson = await PickupPerson.findByPk(Number(pickupPersonId));

    if (!pickupPerson) {
      return res.status(404).json(clientErrorResponse("ID not found."));
    }

    const pickupPersonDocument = await PickupPersonDocument.findOne({
      where: { pickupPersonId: Number(pickupPersonId) },
    });

    if (!pickupPersonDocument) {
      return res.status(404).json(clientErrorResponse("Document not found."));
    }

    if (userPictureStatus)
      pickupPersonDocument.userPictureStatus = userPictureStatus;
    if (userPictureReason)
      pickupPersonDocument.userPictureReason = userPictureReason;
    if (userDocumentStatus)
      pickupPersonDocument.userDocumentStatus = userDocumentStatus;
    if (userDocumentReason)
      pickupPersonDocument.userDocumentReason = userDocumentReason;
    if (vehiclePictureStatus)
      pickupPersonDocument.vehiclePictureStatus = vehiclePictureStatus;
    if (vehiclePictureReason)
      pickupPersonDocument.vehiclePictureReason = vehiclePictureReason;
    if (vehicleDocumentStatus)
      pickupPersonDocument.vehicleDocumentStatus = vehicleDocumentStatus;
    if (vehicleDocumentReason)
      pickupPersonDocument.vehicleDocumentReason = vehicleDocumentReason;

    if (
      pickupPersonDocument.userPictureStatus === STATUS.APPROVED &&
      pickupPersonDocument.userDocumentStatus === STATUS.APPROVED &&
      pickupPersonDocument.vehiclePictureStatus === STATUS.APPROVED &&
      pickupPersonDocument.vehicleDocumentStatus === STATUS.APPROVED
    ) {
      pickupPerson.status = STATUS.APPROVED;
    } else {
      pickupPerson.status = STATUS.REJECTED;
    }

    await pickupPerson.save();
    await pickupPersonDocument.save();

    return res.status(200).json(successResponse("Verification successful."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyRestaurantDocument = async (req, res) => {
  try {
    const restaurantId = req.params.userId;
    const {
      userPictureStatus,
      userPictureReason,
      userDocumentStatus,
      userDocumentReason,
      restaurantDocumentStatus,
      restaurantDocumentReason,
    } = req.body;

    if (!restaurantId || isNaN(restaurantId)) {
      return res.status(400).json(clientErrorResponse("ID is required."));
    }

    const allowedStatuses = Object.values(STATUS);

    if (
      (userPictureStatus && !allowedStatuses.includes(userPictureStatus)) ||
      (userDocumentStatus && !allowedStatuses.includes(userDocumentStatus)) ||
      (restaurantDocumentStatus &&
        !allowedStatuses.includes(restaurantDocumentStatus))
    ) {
      return res.status(400).json(clientErrorResponse("Invalid status value."));
    }

    const restaurant = await Restaurant.findByPk(Number(restaurantId));

    if (!restaurant) {
      return res.status(404).json(clientErrorResponse("ID not found."));
    }

    const restaurantDocument = await RestaurantDocument.findOne({
      where: { restaurantId: Number(restaurantId) },
    });

    if (!restaurantDocument) {
      return res.status(404).json(clientErrorResponse("Document not found."));
    }

    if (userPictureStatus)
      restaurantDocument.userPictureStatus = userPictureStatus;
    if (userPictureReason)
      restaurantDocument.userPictureReason = userPictureReason;
    if (userDocumentStatus)
      restaurantDocument.userDocumentStatus = userDocumentStatus;
    if (userDocumentReason)
      restaurantDocument.userDocumentReason = userDocumentReason;
    if (restaurantDocumentStatus)
      restaurantDocument.userDocumentStatus = restaurantDocumentStatus;
    if (restaurantDocumentReason)
      restaurantDocument.userDocumentReason = restaurantDocumentReason;

    if (
      restaurantDocument.userPictureStatus === STATUS.APPROVED &&
      restaurantDocument.userDocumentStatus === STATUS.APPROVED &&
      restaurantDocument.restaurantDocumentStatus === STATUS.APPROVED
    ) {
      restaurant.status = STATUS.APPROVED;
    } else {
      restaurant.status = STATUS.REJECTED;
    }

    await restaurant.save();
    await restaurantDocument.save();

    return res.status(200).json(successResponse("Verification successful."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const id = req.id;

    const admins = await Admin.findAll({
      where: { id: { [Op.ne]: Number(id) }, isVerified: true },
      attributes: ["id", "name", "address", "email", "phoneNumber", "isActive"],
    });

    return res
      .status(200)
      .json(
        successResponse("Restaurants retrieved successfully.", restaurants),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to retrieve restaurants."));
  }
};

export const getAllPickupPerson = async (req, res) => {
  try {
    const pickupPersons = await PickupPerson.findAll({
      where: { isVerified: true },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "phoneNumber",
        "isActive",
        "status",
      ],
    });

    return res
      .status(200)
      .json(
        successResponse(
          "Pickup persons retrieved successfully.",
          pickupPersons,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to retrieve pickup persons."));
  }
};

export const getPickupPersonDocument = async (req, res) => {
  try {
    const pickupPersonId = req.params.userId;
    if (!pickupPersonId || isNaN(Number(pickupPersonId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid pickup person ID is required."));
    }
    const pickupPersonDocument = await PickupPersonDocument.findOne({
      where: { pickupPersonId: Number(pickupPersonId) },
    });

    if (!pickupPersonDocument) {
      return res.status(404).json(clientErrorResponse("Document not found."));
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Pickup person retrieved successfully.",
          pickupPersonDocument,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to retrieve pickup person document."));
  }
};

export const getAllDeliveryPerson = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.findAll({
      where: { isVerified: true },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "phoneNumber",
        "isActive",
        "status",
      ],
    });

    return res
      .status(200)
      .json(
        successResponse(
          "Delivery persons retrieved successfully.",
          deliveryPersons,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to retrieve delivery persons."));
  }
};

export const getDeliveryPersonDocument = async (req, res) => {
  try {
    const deliveryPersonId = req.params.userId;
    if (!deliveryPersonId || isNaN(Number(deliveryPersonId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid delivery person ID is required."));
    }
    const deliveryPersonDocument = await DeliveryPersonDocument.findOne({
      where: { deliveryPersonId: Number(deliveryPersonId) },
    });

    if (!deliveryPersonDocument) {
      return res.status(404).json(clientErrorResponse("Document not found."));
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Delivery person retrieved successfully.",
          deliveryPersonDocument,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        serverErrorResponse("Failed to retrieve delivery person document."),
      );
  }
};

export const getAllRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { isVerified: true },
      attributes: [
        "id",
        "name",
        "address",
        "email",
        "phoneNumber",
        "isActive",
        "status",
      ],
    });

    return res
      .status(200)
      .json(
        successResponse("Restaurants retrieved successfully.", restaurants),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to retrieve restaurants."));
  }
};

export const getRestaurantDocument = async (req, res) => {
  try {
    const restaurantId = req.params.userId;
    if (!restaurantId || isNaN(Number(restaurantId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid restaurant ID is required."));
    }
    const restaurantDocument = await RestaurantDocument.findOne({
      where: { restaurantId: Number(restaurantId) },
    });

    if (!restaurantDocument) {
      return res.status(404).json(clientErrorResponse("Document not found."));
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Restaurant retrieved successfully.",
          restaurantDocument,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to retrieve restaurant document."));
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isVerified: true },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "phoneNumber",
        "isActive",
        "isVerified",
      ],
    });

    return res
      .status(200)
      .json(
        successResponse("Users retrieved successfully.", users),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Failed to retrieve users."));
  }
};