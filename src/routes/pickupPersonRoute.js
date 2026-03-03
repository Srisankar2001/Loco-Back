import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  loginPickupPerson,
  registerPickupPerson,
  resetPasswordPickupPerson,
  sendResetPasswordTokenPickupPerson,
  sendVerifyTokenPickupPerson,
  updateDocumentPickupPerson,
  verifyPickupPerson,
} from "../controllers/pickupPersonController.js";
import { pickupPersonAuth } from "../middlewares/auth.js";
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 },
    { name: "vehiclePicture", maxCount: 1 },
    { name: "vehicleDocument", maxCount: 1 }
  ]),
  registerPickupPerson,
);
router.post("/login", loginPickupPerson);

router.post("/verify-token/:token", verifyPickupPerson);
router.post("/verify", sendVerifyTokenPickupPerson);

router.post("/reset-token/:token", resetPasswordPickupPerson);
router.post("/reset", sendResetPasswordTokenPickupPerson);

router.put(
  "/update-document",
  pickupPersonAuth,
  upload.fields([
    { name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 },
    { name: "vehiclePicture", maxCount: 1 },
    { name: "vehicleDocument", maxCount: 1 }
  ]),
  updateDocumentPickupPerson,
);
export default router;
