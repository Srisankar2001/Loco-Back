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

/**
 * @openapi
 * tags:
 *   name: DeliveryPersons
 *   description: Delivery person management and authentication
 */

/**
 * @openapi
 * /delivery-person/register:
 *   post:
 *     tags: [DeliveryPersons]
 *     summary: Register a new delivery person
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
 *     responses:
 *       201:
 *         description: Registered successfully
 */
router.post(
  "/register",
  upload.fields([
    { name: "userPicture", maxCount: 1 },
    { name: "userDocument", maxCount: 1 }
  ]),
  registerDeliveryPerson,
);

/**
 * @openapi
 * /delivery-person/login:
 *   post:
 *     tags: [DeliveryPersons]
 *     summary: Delivery person login
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
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", loginDeliveryPerson);

/**
 * @openapi
 * /delivery-person/verify-token/{token}:
 *   post:
 *     tags: [DeliveryPersons]
 *     summary: Verify delivery person email token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post("/verify-token/:token", verifyDeliveryPerson);

/**
 * @openapi
 * /delivery-person/verify:
 *   post:
 *     tags: [DeliveryPersons]
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
router.post("/verify", sendVerifyTokenDeliveryPerson);

/**
 * @openapi
 * /delivery-person/reset-token/{token}:
 *   post:
 *     tags: [DeliveryPersons]
 *     summary: Reset delivery person password with token
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
router.post("/reset-token/:token", resetPasswordDeliveryPerson);

/**
 * @openapi
 * /delivery-person/reset:
 *   post:
 *     tags: [DeliveryPersons]
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
router.post("/reset", sendResetPasswordTokenDeliveryPerson);

/**
 * @openapi
 * /delivery-person/update-document:
 *   put:
 *     tags: [DeliveryPersons]
 *     summary: Update delivery person documents
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
 *     responses:
 *       200:
 *         description: Documents updated
 */
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
