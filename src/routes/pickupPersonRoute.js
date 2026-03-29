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
 * tags:
 *   name: PickupPersons
 *   description: Pickup person management and authentication
 */

/**
 * @openapi
 * /pickup-person/register:
 *   post:
 *     tags: [PickupPersons]
 *     summary: Register a new pickup person
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, phoneNumber, password]
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               email: { type: string }
 *               phoneNumber: { type: string }
 *               password: { type: string }
 *               userPicture: { type: string, format: binary }
 *               userDocument: { type: string, format: binary }
 *               vehiclePicture: { type: string, format: binary }
 *               vehicleDocument: { type: string, format: binary }
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
 *     tags: [PickupPersons]
 *     summary: Pickup person login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 */
router.post("/login", loginPickupPerson);

/**
 * @openapi
 * /pickup-person/verify-token/{token}:
 *   post:
 *     tags: [PickupPersons]
 *     summary: Verify pickup person email token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 */
router.post("/verify-token/:token", verifyPickupPerson);

/**
 * @openapi
 * /pickup-person/verify:
 *   post:
 *     tags: [PickupPersons]
 *     summary: Resend verification token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 */
router.post("/verify", sendVerifyTokenPickupPerson);

/**
 * @openapi
 * /pickup-person/reset-token/{token}:
 *   post:
 *     tags: [PickupPersons]
 *     summary: Reset pickup person password with token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string }
 */
router.post("/reset-token/:token", resetPasswordPickupPerson);

/**
 * @openapi
 * /pickup-person/reset:
 *   post:
 *     tags: [PickupPersons]
 *     summary: Send password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 */
router.post("/reset", sendResetPasswordTokenPickupPerson);

/**
 * @openapi
 * /pickup-person/update-document:
 *   put:
 *     tags: [PickupPersons]
 *     summary: Update pickup person documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userPicture: { type: string, format: binary }
 *               userDocument: { type: string, format: binary }
 *               vehiclePicture: { type: string, format: binary }
 *               vehicleDocument: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Documents updated
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
