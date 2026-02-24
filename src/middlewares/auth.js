import jwt from 'jsonwebtoken'
import { clientErrorResponse } from '../dto/response';

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
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
    return res
      .status(401)
      .json(clientErrorResponse("Authentication failed."));
  }
};

export const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
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
    return res
      .status(401)
      .json(clientErrorResponse("Authentication failed."));
  }
};