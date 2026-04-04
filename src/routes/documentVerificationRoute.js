import express from "express";
import {
  getDeliveryPersonDocs,
  verifyDeliveryPersonDocument,
  getPickupPersonDocs,
  verifyPickupPersonDocument,
  getRestaurantDocs,
  verifyRestaurantDocument,
} from "../controllers/documentVerificationController.js";

const router = express.Router();

router.get("/delivery/:id", getDeliveryPersonDocs);
router.put("/delivery/:personId/verify", verifyDeliveryPersonDocument);

router.get("/pickup/:id", getPickupPersonDocs);
router.put("/pickup/:personId/verify", verifyPickupPersonDocument);

router.get("/restaurant/:id", getRestaurantDocs);
router.put("/restaurant/:restaurantId/verify", verifyRestaurantDocument);

export default router;