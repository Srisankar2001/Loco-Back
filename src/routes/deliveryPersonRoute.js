import express from "express";
import {
  loginDeliveryPerson,
  registerDeliveryPerson,
  resetPasswordDeliveryPerson,
  sendResetPasswordTokenDeliveryPerson,
  sendVerifyTokenDeliveryPerson,
  updateDocumentDeliveryPerson,
  verifyDeliveryPerson,
} from "../controllers/deliveryPersonController.js";
import { upload } from "../middlewares/multer.js";
import { deliveryPersonAuth } from "../middlewares/auth.js";
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 }
  ]),
  registerDeliveryPerson,
);
router.post("/login", loginDeliveryPerson);

router.post("/verify-token/:token", verifyDeliveryPerson);
router.post("/verify", sendVerifyTokenDeliveryPerson);

router.post("/reset-token/:token", resetPasswordDeliveryPerson);
router.post("/reset", sendResetPasswordTokenDeliveryPerson);

router.put(
  "/update-document",
  deliveryPersonAuth,
  upload.fields([
    { name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 }
  ]),
  updateDocumentDeliveryPerson,
);
export default router;
