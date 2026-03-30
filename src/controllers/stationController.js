import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";

const Station = model.Station;
const LineStation = model.LineStation;
const StationStop = model.StationStop;

export const createStation = async (req, res) => {
  try {
    const { name, locationLongitude, locationLatitude } = req.body;
    if (!name || !locationLongitude || !locationLatitude) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const existingName = await Station.findOne({ where: { name } });
    if (existingName) {
      return res
        .status(400)
        .json(clientErrorResponse("Station name already exists."));
    }

    await Station.create({
      name,
      locationLongitude,
      locationLatitude,
    });

    return res
      .status(201)
      .json(successResponse("Station created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const updateStation = async (req, res) => {
  try {
    const stationId = req.params.stationId;
    const { name, locationLongitude, locationLatitude } = req.body;

    if (!stationId) {
      return res
        .status(400)
        .json(clientErrorResponse("Station ID is required."));
    }

    if (!name && !locationLongitude && !locationLatitude) {
      return res
        .status(400)
        .json(clientErrorResponse("No data provided for update."));
    }

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(400).json(clientErrorResponse("Station not found."));
    }

    if (name && station.name !== name) {
      const existingName = await Station.findOne({ where: { name } });
      if (existingName) {
        return res
          .status(400)
          .json(clientErrorResponse("Station name already exists."));
      }
      station.name = name;
    }

    if (locationLongitude && station.locationLongitude !== locationLongitude) {
      station.locationLongitude = locationLongitude;
    }

    if (locationLatitude && station.locationLatitude !== locationLatitude) {
      station.locationLatitude = locationLatitude;
    }

    await station.save();

    return res
      .status(200)
      .json(successResponse("Station updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteStation = async (req, res) => {
  try {
    const stationId = req.params.stationId;

    if (!stationId) {
      return res
        .status(400)
        .json(clientErrorResponse("Station ID is required."));
    }

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(400).json(clientErrorResponse("Station not found."));
    }

    const lineStations = await LineStation.count({ where: { stationId } });

    if (lineStations > 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Station cannot be deleted because lines are associated with it.",
          ),
        );
    }

    const stationStops = await StationStop.count({ where: { stationId } });

    if (stationStops > 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Station cannot be deleted because Schedules are associated with it.",
          ),
        );
    }

    await station.destroy();

    return res
      .status(200)
      .json(successResponse("Station deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getStation = async (req, res) => {
  try {
    const stationId = req.params.stationId;

    if (!stationId) {
      return res
        .status(400)
        .json(clientErrorResponse("Station ID is required."));
    }

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(400).json(clientErrorResponse("Station not found."));
    }

    return res
      .status(200)
      .json(successResponse("Station retrieved successfully.", station));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getAllStation = async (req, res) => {
  try {
    const stations = await Station.findAll();

    return res
      .status(200)
      .json(successResponse("Stations retrieved successfully.", stations));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
