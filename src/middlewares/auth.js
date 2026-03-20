import jwt from "jsonwebtoken";
import { clientErrorResponse } from "../dto/response.js";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Authorization token is missing."));
    }

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid authorization format."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    req.id = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json(clientErrorResponse("Authentication failed."));
  }
};

export const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Authorization token is missing."));
    }

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid authorization format."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);

    req.id = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json(clientErrorResponse("Authentication failed."));
  }
};

export const pickupPersonAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Authorization token is missing."));
    }

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid authorization format."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_PICKUP_PERSON);

    req.id = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json(clientErrorResponse("Authentication failed."));
  }
};

export const deliveryPersonAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Authorization token is missing."));
    }

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid authorization format."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_DELIVERY_PERSON);

    req.id = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json(clientErrorResponse("Authentication failed."));
  }
};

export const restaurantAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Authorization token is missing."));
    }

    if (!token) {
      return res
        .status(401)
        .json(clientErrorResponse("Invalid authorization format."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_RESTAURANT);

    req.id = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json(clientErrorResponse("Authentication failed."));
  }
};
