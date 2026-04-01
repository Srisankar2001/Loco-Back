import express from "express";
import {
  getTrainLocation,
  stopTrainLocation,
  trainDriverLogin,
} from "../controllers/trainLocationController.js";

const router = express.Router();

router.post("/login", trainDriverLogin);
router.put("/stop", stopTrainLocation);
router.get("/:scheduleId", getTrainLocation);

export default router;