import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";
import db from "../config/db.js";

const Line = model.Line;
const Station = model.Station;
const LineStation = model.LineStation;

export const createLineStations = async (req, res) => {
  const transaction = await db.transaction();
  try {
    //     Payload format
        // {
        //    "lineId": 1,
        //    "stations": [
        //                  { "stationId": 10, "lineOrder": 1 },
        //                  { "stationId": 11, "lineOrder": 2 },
        //                  { "stationId": 12, "lineOrder": 3 }
        //                ]
        // }
    const { lineId, stations } = req.body;
    if (!lineId || !stations || !Array.isArray(stations)) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const line = await Line.findByPk(lineId);
    if (!line) {
      return res.status(400).json(clientErrorResponse("Line not found."));
    }

    const stationIds = stations.map((s) => s.stationId);
    const uniqueIds = new Set(stationIds);

    if (stationIds.length !== uniqueIds.size) {
      return res
        .status(400)
        .json(clientErrorResponse("Duplicate stations are not allowed."));
    }

    stations.sort((a, b) => a.lineOrder - b.lineOrder);

    for (const i of stations) {
      const station = await Station.findByPk(i.stationId);
      if (!station) {
        return res.status(400).json(clientErrorResponse("Station not found."));
      }
    }

    const lineStations = stations.map((s) => ({
      lineId,
      stationId: s.stationId,
      lineOrder: s.lineOrder,
    }));

    await LineStation.destroy({
      where: { lineId },
      transaction,
    });

    await LineStation.bulkCreate(lineStations, { transaction });

    await transaction.commit();
    return res
      .status(201)
      .json(successResponse("Line stations created successfully."));
  } catch (error) {
    await transaction.rollback()
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteLineStations = async (req, res) => {
  try {
    const { lineId } = req.params;

    if (!lineId) {
      return res.status(400).json(clientErrorResponse("lineId is required."));
    }

    const line = await Line.findByPk(lineId);
    if (!line) {
      return res.status(404).json(clientErrorResponse("Line not found."));
    }

    const deletedCount = await LineStation.destroy({
      where: { lineId },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json(clientErrorResponse("No stations found for this line."));
    }

    return res
      .status(200)
      .json(successResponse("Line stations deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getLineStationsByLineId = async (req, res) => {
  try {
    const { lineId } = req.params;

    if (!lineId) {
      return res.status(400).json(clientErrorResponse("lineId is required."));
    }

    const line = await Line.findByPk(lineId);
    if (!line) {
      return res.status(404).json(clientErrorResponse("Line not found."));
    }

    const lineStations = await LineStation.findAll({
      where: { lineId },
      include: [
        {
          model: Station,
          attributes: ["id", "name"],
        },
      ],
      order: [["lineOrder", "ASC"]],
    });

    return res
      .status(200)
      .json(
        successResponse("Line stations fetched successfully.", lineStations),
      );
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
