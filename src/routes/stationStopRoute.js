import express from "express";
import {
  createStationStops,
  deleteStationStopsByScheduleId,
  getStationStopsByScheduleId,
  updateStationStops,
} from "../controllers/stationStopController.js";

const router = express.Router();

/**
 * @openapi
 * /station-stop/create:
 *   post:
 *     tags:
 *       - StationStop
 *     summary: Create Station Stops
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Station stops created
 */
router.post("/create", createStationStops);

/**
 * @openapi
 * /station-stop/update:
 *   put:
 *     tags:
 *       - StationStop
 *     summary: Update Station Stops
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put("/update", updateStationStops);

/**
 * @openapi
 * /station-stop/delete/{scheduleId}:
 *   delete:
 *     tags:
 *       - StationStop
 *     summary: Delete Station Stops by Schedule ID
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/delete/:scheduleId", deleteStationStopsByScheduleId);

/**
 * @openapi
 * /station-stop/get/{scheduleId}:
 *   get:
 *     tags:
 *       - StationStop
 *     summary: Get Station Stops by Schedule ID
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Station stops data
 */
router.get("/get/:scheduleId", getStationStopsByScheduleId);

export default router;
