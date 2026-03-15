import model from "../models/index.js";
import db from "../config/db.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";

const StationStop = model.StationStop;
const Schedule = model.Schedule;
const Station = model.Station;

export const createStationStops = async (req, res) => {
  const transaction = await db.transaction();
  try {
    // Expected payload:
    // {
    //   "scheduleId": 1,
    //   "stops": [
    //      { "stationId": 10, "stopOrder": 1, "arrivalTime": "08:00", "arrivalDayOffset": 0, "departureTime": "08:05", "departureDayOffset": 0 },
    //      { "stationId": 11, "stopOrder": 2, "arrivalTime": "08:30", "arrivalDayOffset": 0, "departureTime": "08:35", "departureDayOffset": 0 }
    //   ]
    // }

    const { scheduleId, stops } = req.body;

    if (!scheduleId || !stops || !Array.isArray(stops) || stops.length === 0) {
      return res
        .status(400)
        .json(clientErrorResponse("scheduleId and stops array are required."));
    }

    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json(clientErrorResponse("Schedule not found."));
    }

    await StationStop.destroy({ where: { scheduleId }, transaction });

    const stationIds = stops.map((s) => s.stationId);
    const uniqueIds = new Set(stationIds);
    if (stationIds.length !== uniqueIds.size) {
      return res
        .status(400)
        .json(clientErrorResponse("Duplicate stations are not allowed."));
    }

    for (const stop of stops) {
      const station = await Station.findByPk(stop.stationId);
      if (!station) {
        return res
          .status(404)
          .json(clientErrorResponse(`Station not found: ${stop.stationId}`));
      }
      if (!stop.arrivalTime || !stop.departureTime || !stop.stopOrder) {
        return res
          .status(400)
          .json(
            clientErrorResponse(
              "arrivalTime, departureTime, and stopOrder are required for all stops."
            )
          );
      }
    }

    const stationStops = stops.map((s) => ({
      scheduleId,
      stationId: s.stationId,
      stopOrder: s.stopOrder,
      arrivalTime: s.arrivalTime,
      arrivalDayOffset: s.arrivalDayOffset ?? 0,
      departureTime: s.departureTime,
      departureDayOffset: s.departureDayOffset ?? 0,
    }));

    await StationStop.bulkCreate(stationStops, { transaction });
    await transaction.commit();

    return res
      .status(201)
      .json(successResponse("Station stops created successfully."));
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const updateStationStops = async (req, res) => {
  const transaction = await db.transaction();
  try {
    // Payload:
    // {
    //   "scheduleId": 1,
    //   "stops": [
    //      { "id": 100, "arrivalTime": "08:10", "arrivalDayOffset": 0, "departureTime": "08:15", "departureDayOffset": 0 },
    //      { "id": 101, "arrivalTime": "08:40", "arrivalDayOffset": 0, "departureTime": "08:45", "departureDayOffset": 0 }
    //   ]
    // }
    const { scheduleId, stops } = req.body;

    if (!scheduleId || !stops || !Array.isArray(stops) || stops.length === 0) {
      return res
        .status(400)
        .json(clientErrorResponse("scheduleId and stops array are required."));
    }

    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json(clientErrorResponse("Schedule not found."));
    }

    for (const stop of stops) {
      if (!stop.id || !stop.arrivalTime || !stop.departureTime) {
        return res
          .status(400)
          .json(
            clientErrorResponse(
              "Each stop must include id, arrivalTime, and departureTime."
            )
          );
      }

      const existingStop = await StationStop.findByPk(stop.id);
      if (!existingStop) {
        return res
          .status(404)
          .json(clientErrorResponse(`StationStop not found: ${stop.id}`));
      }

      existingStop.arrivalTime = stop.arrivalTime;
      existingStop.arrivalDayOffset = stop.arrivalDayOffset ?? existingStop.arrivalDayOffset;
      existingStop.departureTime = stop.departureTime;
      existingStop.departureDayOffset = stop.departureDayOffset ?? existingStop.departureDayOffset;

      await existingStop.save({ transaction });
    }

    await transaction.commit();
    return res
      .status(200)
      .json(successResponse("Station stops updated successfully."));
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getStationStopsByScheduleId = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    if (!scheduleId) {
      return res.status(400).json(clientErrorResponse("scheduleId is required."));
    }

    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json(clientErrorResponse("Schedule not found."));
    }

    const stops = await StationStop.findAll({
      where: { scheduleId },
      include: [
        {
          model: Station,
          as: "station",
          attributes: ["id", "name"],
        },
      ],
      order: [["stopOrder", "ASC"]],
    });

    return res
      .status(200)
      .json(successResponse("Station stops fetched successfully.", stops));
  } catch (error) {
    console.log('Err: ',error)
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteStationStopsByScheduleId = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    if (!scheduleId) {
      return res.status(400).json(clientErrorResponse("scheduleId is required."));
    }

    const deletedCount = await StationStop.destroy({ where: { scheduleId } });
    if (deletedCount === 0) {
      return res
        .status(404)
        .json(clientErrorResponse("No station stops found for this schedule."));
    }

    return res
      .status(200)
      .json(successResponse("Station stops deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};