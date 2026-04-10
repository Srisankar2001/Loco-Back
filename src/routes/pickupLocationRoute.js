import express from "express";
import { getPickupPersonLocation } from "../controllers/pickupLocationController.js";

const router = express.Router();

/**
 * @openapi
 * /pickup-location/{pickupPersonId}:
 *   get:
 *     tags:
 *       - PickupLocations
 *     summary: Get the latest pickup person location
 *     parameters:
 *       - in: path
 *         name: pickupPersonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location fetched successfully
 *       400:
 *         description: Pickup person or location not found
 */
router.get("/:pickupPersonId", getPickupPersonLocation);

export default router;
