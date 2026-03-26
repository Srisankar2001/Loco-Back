import express from "express";
import {
  createLineStations,
  deleteLineStations,
  getLineStationsByLineId,
} from "../controllers/lineStationController.js";

const router = express.Router();

/**
 * @openapi
 * /line-station/create:
 *   post:
 *     tags:
 *       - LineStation
 *     summary: Map stations to a line
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lineId:
 *                 type: integer
 *               stationIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Line stations created
 */
router.post("/create", createLineStations);

/**
 * @openapi
 * /line-station/delete/{lineId}:
 *   delete:
 *     tags:
 *       - LineStation
 *     summary: Remove stations from a line
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Removed successfully
 */
router.delete("/delete/:lineId", deleteLineStations);

/**
 * @openapi
 * /line-station/get/{lineId}:
 *   get:
 *     tags:
 *       - LineStation
 *     summary: Get line stations by line ID
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Line stations data
 */
router.get("/get/:lineId", getLineStationsByLineId);

export default router;
