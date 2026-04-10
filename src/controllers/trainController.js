import bcrypt from "bcrypt";
import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";
import { TRAIN_TYPE } from "../enum/TrainType.js";

const Train = model.Train;
const Schedule = model.Schedule;

export const createTrain = async (req, res) => {
  try {
    const { name, type, pin } = req.body;
    if (!name || !type || !pin) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const existingName = await Train.findOne({ where: { name } });
    if (existingName) {
      return res
        .status(400)
        .json(clientErrorResponse("Train name already exists."));
    }

    const allowedTypes = Object.values(TRAIN_TYPE);

    if (!allowedTypes.includes(type)) {
      return res.status(400).json(clientErrorResponse("Invalid train type."));
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    await Train.create({ name, type, pin: hashedPin });
    return res.status(201).json(successResponse("Train created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const updateTrain = async (req, res) => {
  try {
    const trainId = req.params.trainId;
    const { name, type, pin } = req.body;

    if (!trainId) {
      return res.status(400).json(clientErrorResponse("Train ID is required."));
    }

    if (!name && !type && !pin) {
      return res
        .status(400)
        .json(clientErrorResponse("No data provided for update."));
    }

    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(400).json(clientErrorResponse("Train not found."));
    }

    if (name && train.name !== name) {
      const existingName = await Train.findOne({ where: { name } });
      if (existingName) {
        return res
          .status(400)
          .json(clientErrorResponse("Train name already exists."));
      }
      train.name = name;
    }

    if (type && train.type !== type) {
      const allowedTypes = Object.values(TRAIN_TYPE);
      if (!allowedTypes.includes(type)) {
        return res.status(400).json(clientErrorResponse("Invalid type value."));
      }
      train.type = type;
    }

    if (pin) {
      const hashedPin = await bcrypt.hash(pin, 10);
      train.pin = hashedPin;
    }

    await train.save();

    return res.status(200).json(successResponse("Train updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteTrain = async (req, res) => {
  try {
    const trainId = req.params.trainId;

    if (!trainId) {
      return res.status(400).json(clientErrorResponse("Train ID is required."));
    }

    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(400).json(clientErrorResponse("Train not found."));
    }

    const schedules = await Schedule.count({ where: { trainId } });
    if (schedules > 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Train cannot be deleted because schedules are associated with it.",
          ),
        );
    }

    await train.destroy();

    return res.status(200).json(successResponse("Train deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getTrain = async (req, res) => {
  try {
    const trainId = req.params.trainId;

    if (!trainId) {
      return res.status(400).json(clientErrorResponse("Train ID is required."));
    }

    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(400).json(clientErrorResponse("Train not found."));
    }

    return res
      .status(200)
      .json(successResponse("Train retrieved successfully.", train));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.findAll();
    return res
      .status(200)
      .json(successResponse("Trains retrieved successfully.", trains));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
