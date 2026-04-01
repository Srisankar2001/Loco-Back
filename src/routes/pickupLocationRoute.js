import express from "express";
import { getPickupPersonLocation } from "../controllers/pickupLocationController.js";

const router = express.Router();

router.get("/:pickupPersonId", getPickupPersonLocation);

export default router;