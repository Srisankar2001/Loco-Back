import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";

const Route = model.Route;
const Schedule = model.Schedule;
const Line = model.Line;
const Station = model.Station;
const LineStation = model.LineStation;

export const createRoute = async (req, res) => {
  try {
    const { name, lineId, startStationId, endStationId, isReverse } = req.body;
    if (
      !name ||
      !lineId ||
      !startStationId ||
      !endStationId ||
      isReverse === null
    ) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const existingName = await Route.findOne({ where: { name } });
    if (existingName) {
      return res
        .status(400)
        .json(clientErrorResponse("Route name already exists."));
    }

    const line = await Line.findByPk(lineId);
    if (!line) {
      return res.status(400).json(clientErrorResponse("Line not found."));
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

    const start = await LineStation.findOne({
      where: { lineId, stationId: startStationId },
    });
    if (!start) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Start station does not belong to the selected line.",
          ),
        );
    }
    const end = await LineStation.findOne({
      where: { lineId, stationId: endStationId },
    });
    if (!end) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "End station does not belong to the selected line.",
          ),
        );
    }

    const startOrder = Number(start.lineOrder);
    const endOrder = Number(end.lineOrder);

    if (isReverse) {
      if (startOrder <= endOrder) {
        return res
          .status(400)
          .json(
            clientErrorResponse(
              "Invalid station order for reverse route. Start station must appear after end station in the line.",
            ),
          );
      }
    } else {
      if (startOrder >= endOrder) {
        return res
          .status(400)
          .json(
            clientErrorResponse(
              "Invalid station order for forward route. Start station must appear before end station in the line.",
            ),
          );
      }
    }

    await Route.create({
      name,
      lineId,
      startStation: startStationId,
      endStation: endStationId,
      isReverse,
    });

    return res.status(201).json(successResponse("Route created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const updateRoute = async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const { name, lineId, startStationId, endStationId, isReverse } = req.body;

    if (!routeId) {
      return res.status(400).json(clientErrorResponse("Route ID is required."));
    }

    if (
      !name &&
      !lineId &&
      !startStationId &&
      !endStationId &&
      isReverse === null
    ) {
      return res
        .status(400)
        .json(clientErrorResponse("No data provided for update."));
    }

    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(400).json(clientErrorResponse("Route not found."));
    }

    if (name && route.name !== name) {
      const existingName = await Route.findOne({ where: { name } });
      if (existingName) {
        return res
          .status(400)
          .json(clientErrorResponse("Route name already exists."));
      }
      route.name = name;
    }

    if (lineId && route.lineId !== lineId) {
      const line = await Line.findByPk(lineId);
      if (!line) {
        return res.status(400).json(clientErrorResponse("Line not found."));
      }
      route.lineId = lineId;
    }

    if (isReverse !== null && route.isReverse !== isReverse) {
      route.isReverse = isReverse;
    }

    if (startStationId && route.startStation !== startStationId) {
      const startStation = await Station.findByPk(startStationId);
      if (!startStation) {
        return res
          .status(400)
          .json(clientErrorResponse("Start station not found."));
      }
      route.startStation = startStationId;
    }

    if (endStationId && route.endStation !== endStationId) {
      const endStation = await Station.findByPk(endStationId);
      if (!endStation) {
        return res
          .status(400)
          .json(clientErrorResponse("End station not found."));
      }
      route.endStation = endStationId;
    }

    const start = await LineStation.findOne({
      where: { lineId, stationId: route.startStationId },
    });
    if (!start) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Start station does not belong to the selected line.",
          ),
        );
    }
    const end = await LineStation.findOne({
      where: { lineId, stationId: route.endStationId },
    });
    if (!end) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "End station does not belong to the selected line.",
          ),
        );
    }

    const startOrder = Number(start.lineOrder);
    const endOrder = Number(end.lineOrder);

    if (route.isReverse) {
      if (startOrder <= endOrder) {
        return res
          .status(400)
          .json(
            clientErrorResponse(
              "Invalid station order for reverse route. Start station must appear after end station in the line.",
            ),
          );
      }
    } else {
      if (startOrder >= endOrder) {
        return res
          .status(400)
          .json(
            clientErrorResponse(
              "Invalid station order for forward route. Start station must appear before end station in the line.",
            ),
          );
      }
    }

    await route.save();

    return res.status(200).json(successResponse("Route updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const routeId = req.params.routeId;

    if (!routeId) {
      return res.status(400).json(clientErrorResponse("Route ID is required."));
    }

    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(400).json(clientErrorResponse("Route not found."));
    }

    const schedules = await Schedule.count({ where: { routeId } });
    if (schedules > 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "Route cannot be deleted because schedules are associated with it.",
          ),
        );
    }

    await route.destroy();

    return res.status(200).json(successResponse("Route deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getRoute = async (req, res) => {
  try {
    const routeId = req.params.routeId;

    if (!routeId) {
      return res.status(400).json(clientErrorResponse("Route ID is required."));
    }

    const route = await Route.findByPk(routeId, {
      include: [
        { model: Line },
        { model: Station, as: "startStation" },
        { model: Station, as: "endStation" },
      ],
    });

    if (!route) {
      return res.status(400).json(clientErrorResponse("Route not found."));
    }

    return res
      .status(200)
      .json(successResponse("Route retrieved successfully.", route));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getAllRoute = async (req, res) => {
  try {
    const routes = await Route.findAll({
      include: [
        { model: Line },
        { model: Station, as: "startStation" },
        { model: Station, as: "endStation" },
      ],
    });

    return res
      .status(200)
      .json(successResponse("Routes retrieved successfully.", routes));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
