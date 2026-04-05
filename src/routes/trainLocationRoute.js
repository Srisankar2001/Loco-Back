import express from "express";
import {
  getTrainLocation,
  stopTrainLocation,
  trainDriverLogin,
} from "../controllers/trainLocationController.js";

const router = express.Router();

/**
 * @openapi
 * /train-location/login:
 *   post:
 *     tags:
 *       - TrainLocations
 *     summary: Train driver login with schedule ID and PIN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - pin
 *             properties:
 *               scheduleId:
 *                 type: integer
 *               pin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", trainDriverLogin);

/**
 * @openapi
 * /train-location/stop:
 *   put:
 *     tags:
 *       - TrainLocations
 *     summary: Stop train location sharing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *             properties:
 *               scheduleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Location sharing stopped
 */
router.put("/stop", stopTrainLocation);

/**
 * @openapi
 * /train-location/{scheduleId}:
 *   get:
 *     tags:
 *       - TrainLocations
 *     summary: Get the latest train location by schedule ID
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location fetched successfully
 *       400:
 *         description: Schedule or location not found
 */
router.get("/:scheduleId", getTrainLocation);

export default router;
