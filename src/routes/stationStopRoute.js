import express from "express";
import {
  createStationStops,
  deleteStationStopsByScheduleId,
  getStationStopsByScheduleId,
  updateStationStops,
} from "../controllers/stationStopController.js";

const router = express.Router();

router.post("/create", createStationStops);

router.put("/update", updateStationStops);

router.delete("/delete/:scheduleId", deleteStationStopsByScheduleId);

router.get("/get/:scheduleId", getStationStopsByScheduleId);

export default router;
