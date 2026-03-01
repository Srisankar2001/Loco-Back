import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  loginRestaurant,
  registerRestaurant,
  resetPasswordRestaurant,
  sendResetPasswordTokenRestaurant,
  sendVerifyTokenRestaurant,
  updateDocumentRestaurant,
  verifyRestaurant,
} from "../controllers/restaurantController.js";
import { restaurantAuth } from "../middlewares/auth.js";
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 },
    { name: "restaurantDocument", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  registerRestaurant,
);
router.post("/login", loginRestaurant);

router.post("/verify-token/:token", verifyRestaurant);
router.post("/verify", sendVerifyTokenRestaurant);

router.post("/reset-token/:token", resetPasswordRestaurant);
router.post("/reset", sendResetPasswordTokenRestaurant);

router.put(
  "/update-document",
  restaurantAuth,
  upload.fields([
    { name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 },
    { name: "restaurantDocument", maxCount: 1 }
  ]),
  updateDocumentRestaurant,
);
export default router;
