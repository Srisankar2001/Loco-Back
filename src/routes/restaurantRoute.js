import express from "express";
import { upload } from "../middlewares/multer";
import { loginRestaurant, registerRestaurant, resetPasswordRestaurant, sendResetPasswordTokenRestaurant, sendVerifyTokenRestaurant, verifyRestaurant } from "../controllers/restaurantController";
const router = express.Router();

router.post(
  "/register",
  upload.fields[
    ({ name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 },
    { name: "restaurantDocument", maxCount: 1 },
    { name: "image", maxCount: 1 })
  ],
  registerRestaurant,
);
router.post("/login", loginRestaurant);

router.post("/verify-token/:token", verifyRestaurant);
router.post("/verify", sendVerifyTokenRestaurant);

router.post("/reset-token/:token", resetPasswordRestaurant);
router.post("/reset", sendResetPasswordTokenRestaurant);

export default router;
