import express from "express";
import {
  createLineStations,
  deleteLineStations,
  getLineStationsByLineId,
} from "../controllers/lineStationController.js";

const router = express.Router();

router.post("/create", createLineStations);

router.delete("/delete/:lineId", deleteLineStations);

router.get("/get/:lineId", getLineStationsByLineId);

export default router;
