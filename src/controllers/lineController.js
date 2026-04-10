import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";

const Line = model.Line;
const Station = model.Station;
const Route = model.Route;
const LineStation = model.LineStation;

export const createLine = async (req, res) => {
  try {
    const { name, startStationId, endStationId } = req.body;
    if (!name || !startStationId || !endStationId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const existingName = await Line.findOne({ where: { name } });
    if (existingName) {
      return res
        .status(400)
        .json(clientErrorResponse("Line name already exists."));
    }

    const startStation = await Station.findByPk(startStationId);
    if (!startStation) {
      return res
        .status(400)
        .json(clientErrorResponse("Start station not found."));
    }

    const endStation = await Station.findByPk(endStationId);
    if (!endStation) {
      return res
        .status(400)
        .json(clientErrorResponse("End station not found."));
    }

    await Line.create({
      name,
      startStationId,
      endStationId,
    });

    return res.status(201).json(successResponse("Line created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const updateLine = async (req, res) => {
  try {
    const lineId = req.params.lineId;
    const { name, startStationId, endStationId } = req.body;

    if (!lineId) {
      return res.status(400).json(clientErrorResponse("Line ID is required."));
    }

    if (!name && !startStationId && !endStationId) {
      return res
        .status(400)
        .json(clientErrorResponse("No data provided for update."));
    }

    const line = await Line.findByPk(lineId);
    if (!line) {
      return res.status(400).json(clientErrorResponse("Line not found."));
    }

    if (name && line.name !== name) {
      const existingName = await Line.findOne({ where: { name } });
      if (existingName) {
        return res
          .status(400)
          .json(clientErrorResponse("Line name already exists."));
      }
      line.name = name;
    }

    if (startStationId && line.startStation !== startStationId) {
      const startStation = await Station.findByPk(startStationId);
      if (!startStation) {
        return res
          .status(400)
          .json(clientErrorResponse("Start station not found."));
      }

        line.startStationId = startStationId;
    }

    if (endStationId && line.endStation !== endStationId) {
      const endStation = await Station.findByPk(endStationId);
      if (!endStation) {
        return res
          .status(400)
          .json(clientErrorResponse("End station not found."));
      }

      line.endStationId = endStationId;
    }

    await line.save();

    return res.status(200).json(successResponse("Line updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteLine = async (req, res) => {
  try {
    const lineId = req.params.lineId;

    if (!lineId) {
      return res.status(400).json(clientErrorResponse("Line ID is required."));
    }

    const line = await Line.findByPk(lineId);
    if (!line) {
      return res.status(400).json(clientErrorResponse("Line not found."));
    }

    const routes = await Route.count({ where: { lineId } });
    if (routes > 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Line cannot be deleted because routes are associated with it.",
          ),
        );
    }

    const lineStations = await LineStation.count({ where: { lineId } });

    if (lineStations > 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Line cannot be deleted because stations are associated with it.",
          ),
        );
    }

    await line.destroy();

    return res.status(200).json(successResponse("Line deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getLine = async (req, res) => {
  try {
    const lineId = req.params.lineId;

    if (!lineId) {
      return res.status(400).json(clientErrorResponse("Line ID is required."));
    }

    const line = await Line.findByPk(lineId, {
      include: [
        { model: Station, as: "startStation" },
        { model: Station, as: "endStation" },
      ],
    });
    if (!line) {
      return res.status(400).json(clientErrorResponse("Line not found."));
    }

    return res
      .status(200)
      .json(successResponse("Line retrieved successfully.", line));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getAllLine = async (req, res) => {
  try {
    const lines = await Line.findAll({
      include: [
        { model: Station, as: "startStation" },
        { model: Station, as: "endStation" },
      ],
    });

    return res
      .status(200)
      .json(successResponse("Lines retrieved successfully.", lines));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
