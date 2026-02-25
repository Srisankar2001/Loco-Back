import express from "express";
import { upload } from "../middlewares/multer";
import { loginPickupPerson, registerPickupPerson, resetPasswordPickupPerson, sendResetPasswordTokenPickupPerson, sendVerifyTokenPickupPerson, verifyPickupPerson } from "../controllers/pickupPersonController";
const router = express.Router();

router.post(
  "/register",
  upload.fields[
    ({ name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 },
    { name: "vehiclePicture", maxCount: 1 },
    { name: "vehicleDocument", maxCount: 1 })
  ],
  registerPickupPerson,
);
router.post("/login", loginPickupPerson);

router.post("/verify-token/:token", verifyPickupPerson);
router.post("/verify", sendVerifyTokenPickupPerson);

router.post("/reset-token/:token", resetPasswordPickupPerson);
router.post("/reset", sendResetPasswordTokenPickupPerson);

export default router;
