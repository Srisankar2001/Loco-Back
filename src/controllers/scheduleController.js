import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";
import { DAY } from "../enum/Day.js";

const Train = model.Train;
const Route = model.Route;
const Schedule = model.Schedule;
const StationStop = model.StationStop;

const normalizeDays = (days) =>
  [...new Set(days.map((d) => String(d).trim().toUpperCase()))];

export const createSchedule = async (req, res) => {
  try {
    const { trainId, routeId, day, dayOffset } = req.body;

    if (!trainId || !routeId || dayOffset === undefined || dayOffset === null) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    if (!Array.isArray(day) || day.length === 0) {
      return res
        .status(400)
        .json(clientErrorResponse("Days must be an array."));
    }

    const allowedDays = Object.values(DAY);
    const uniqueDays = normalizeDays(day);

    for (const d of uniqueDays) {
      if (!allowedDays.includes(d)) {
        return res
          .status(400)
          .json(clientErrorResponse(`Invalid day passed: ${d}`));
      }
    }

    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(400).json(clientErrorResponse("Route not found."));
    }

    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(400).json(clientErrorResponse("Train not found."));
    }

    const existingSchedule = await Schedule.findOne({
      where: { trainId, routeId },
    });

    if(existingSchedule){
      return res.status(400).json(clientErrorResponse("Schedule is not exist"));
    }

    await Schedule.create({
      trainId,
      routeId,
      day: uniqueDays,
      dayOffset,
    });

    return res
      .status(201)
      .json(successResponse("Schedule created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { trainId, routeId, day, dayOffset } = req.body;

    if (!scheduleId) {
      return res
        .status(400)
        .json(clientErrorResponse("Schedule ID is required."));
    }

    if (
      !trainId &&
      !routeId &&
      !day && !Array.isArray(day) &&
      dayOffset === undefined && dayOffset === null
    ) {
      return res
        .status(400)
        .json(clientErrorResponse("No data provided for update."));
    }

    const schedule = await Schedule.findByPk(scheduleId);

    if (!schedule) {
      return res.status(400).json(clientErrorResponse("Schedule not found."));
    }

    if (trainId && schedule.trainId !== trainId) {
      const train = await Train.findByPk(trainId);
      if (!train) {
        return res.status(400).json(clientErrorResponse("Train not found."));
      }

      schedule.trainId = trainId;
    }

    if (routeId && schedule.routeId !== routeId) {
      const route = await Route.findByPk(routeId);
      if (!route) {
        return res.status(400).json(clientErrorResponse("Route not found."));
      }

      schedule.routeId = routeId;
    }

    if (day !== undefined) {
      if (!Array.isArray(day) || day.length === 0) {
        return res
          .status(400)
          .json(clientErrorResponse("Days must be an array."));
      }

      const allowedDays = Object.values(DAY);
      const uniqueDays = normalizeDays(day);

      for (const d of uniqueDays) {
        if (!allowedDays.includes(d)) {
          return res
            .status(400)
            .json(clientErrorResponse(`Invalid day passed: ${d}`));
        }
      }

      schedule.day = uniqueDays;
    }

    if (dayOffset !== undefined && dayOffset !== null) {
      schedule.dayOffset = dayOffset;
    }

    await schedule.save();

    return res
      .status(200)
      .json(successResponse("Schedule updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    if (!scheduleId) {
      return res
        .status(400)
        .json(clientErrorResponse("Schedule ID is required."));
    }

    const schedule = await Schedule.findByPk(scheduleId);

    if (!schedule) {
      return res.status(400).json(clientErrorResponse("Schedule not found."));
    }

    const stationStops = await StationStop.count({ where: { scheduleId } });

    if (stationStops > 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Schedule cannot be deleted because timetables are associated with it."
          )
        );
    }

    await schedule.destroy();

    return res
      .status(200)
      .json(successResponse("Schedule deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    if (!scheduleId) {
      return res
        .status(400)
        .json(clientErrorResponse("Schedule ID is required."));
    }

    const schedule = await Schedule.findByPk(scheduleId, {
      include: [
        { model: Train },
        { model: Route }
      ],
    });

    if (!schedule) {
      return res.status(400).json(clientErrorResponse("Schedule not found."));
    }

    return res
      .status(200)
      .json(successResponse("Schedule retrieved successfully.", schedule));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      include: [
        { model: Train },
        { model: Route }
      ],
    });

    return res
      .status(200)
      .json(successResponse("Schedules retrieved successfully.", schedules));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
