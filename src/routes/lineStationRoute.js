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
 *       description: Payload for assigning ordered stations to a line.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lineId
 *               - stations
 *             properties:
 *               lineId:
 *                 type: integer
 *                 description: ID of the line.
 *                 example: 1
 *               stations:
 *                 type: array
 *                 description: Ordered list of stations for the line.
 *                 items:
 *                   type: object
 *                   required:
 *                     - stationId
 *                     - lineOrder
 *                   properties:
 *                     stationId:
 *                       type: integer
 *                       description: ID of the station.
 *                       example: 10
 *                     lineOrder:
 *                       type: integer
 *                       description: Sequence of the station in the line.
 *                       example: 1
 *           example:
 *             lineId: 1
 *             stations:
 *               - stationId: 10
 *                 lineOrder: 1
 *               - stationId: 11
 *                 lineOrder: 2
 *               - stationId: 12
 *                 lineOrder: 3
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
