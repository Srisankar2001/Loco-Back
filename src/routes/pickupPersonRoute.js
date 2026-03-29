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

/**
 * @openapi
 * /pickup-person/register:
 *   post:
 *     tags:
 *       - PickupPerson
 *     summary: Register Pickup Person
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userPicture:
 *                 type: string
 *                 format: binary
 *               userDocument:
 *                 type: string
 *                 format: binary
 *               vehiclePicture:
 *                 type: string
 *                 format: binary
 *               vehicleDocument:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Registered successfully
 */
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

/**
 * @openapi
 * /pickup-person/login:
 *   post:
 *     tags:
 *       - PickupPerson
 *     summary: Login Pickup Person
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/login", loginPickupPerson);

/**
 * @openapi
 * /pickup-person/verify-token/{token}:
 *   post:
 *     tags:
 *       - PickupPerson
 *     summary: Verify Token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token verified
 */
router.post("/verify-token/:token", verifyPickupPerson);

/**
 * @openapi
 * /pickup-person/verify:
 *   post:
 *     tags:
 *       - PickupPerson
 *     summary: Send Verify Token
 *     responses:
 *       200:
 *         description: Verify token sent
 */
router.post("/verify", sendVerifyTokenPickupPerson);

/**
 * @openapi
 * /pickup-person/reset-token/{token}:
 *   post:
 *     tags:
 *       - PickupPerson
 *     summary: Reset Password via Token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/reset-token/:token", resetPasswordPickupPerson);

/**
 * @openapi
 * /pickup-person/reset:
 *   post:
 *     tags:
 *       - PickupPerson
 *     summary: Send Reset Password Token
 *     responses:
 *       200:
 *         description: Reset token sent
 */
router.post("/reset", sendResetPasswordTokenPickupPerson);

/**
 * @openapi
 * /pickup-person/update-document:
 *   put:
 *     tags:
 *       - PickupPerson
 *     summary: Update Pickup Person Documents
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userPicture:
 *                 type: string
 *                 format: binary
 *               userDocument:
 *                 type: string
 *                 format: binary
 *               vehiclePicture:
 *                 type: string
 *                 format: binary
 *               vehicleDocument:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Documents updated successfully
 */
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
