import model from "../models/index.js";
import bcrypt from "bcrypt";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";

const Train = model.Train;
const Schedule = model.Schedule;
const TrainLocation = model.TrainLocation;

// Train Driver | Login with scheduleId and PIN
export const trainDriverLogin = async (req, res) => {
  try {
    const { scheduleId, pin } = req.body;
    if (!scheduleId || !pin) {
      return res.status(400).json(clientErrorResponse("All fields are required."));
    }

    const schedule = await Schedule.findByPk(scheduleId, {
      include: [{ model: Train }],
    });
    if (!schedule) {
      return res.status(400).json(clientErrorResponse("Schedule not found."));
    }

    const isValid = await bcrypt.compare(pin, schedule.Train.pin);
    if (!isValid) {
      return res.status(400).json(clientErrorResponse("Invalid PIN."));
    }

    return res.status(200).json(successResponse("Login successful.", { scheduleId, trainId: schedule.Train.id }));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Train Driver | Stop sharing location
export const stopTrainLocation = async (req, res) => {
  try {
    const { scheduleId } = req.body;
    if (!scheduleId) {
      return res.status(400).json(clientErrorResponse("All fields are required."));
    }

    const location = await TrainLocation.findOne({ where: { scheduleId } });
    if (!location) {
      return res.status(400).json(clientErrorResponse("No active tracking found."));
    }

    location.isActive = false;
    await location.save();

    return res.status(200).json(successResponse("Location sharing stopped."));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// User | Get last known train location
export const getTrainLocation = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    if (!scheduleId) {
      return res.status(400).json(clientErrorResponse("Schedule ID is required."));
    }

    const location = await TrainLocation.findOne({ where: { scheduleId } });
    if (!location) {
      return res.status(400).json(clientErrorResponse("No location found."));
    }

    return res.status(200).json(successResponse("Location fetched successfully.", location));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};