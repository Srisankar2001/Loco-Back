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
 * /delivery-person/register:
 *   post:
 *     tags:
 *       - DeliveryPerson
 *     summary: Register Delivery Person
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - phoneNumber
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               userPicture:
 *                 type: string
 *                 format: binary
 *               userDocument:
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
    { name: "userDocument", maxCount: 1 }
  ]),
  registerDeliveryPerson,
);

/**
 * @openapi
 * /delivery-person/login:
 *   post:
 *     tags:
 *       - DeliveryPerson
 *     summary: Login Delivery Person
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/login", loginDeliveryPerson);

/**
 * @openapi
 * /delivery-person/verify-token/{token}:
 *   post:
 *     tags:
 *       - DeliveryPerson
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
router.post("/verify-token/:token", verifyDeliveryPerson);

/**
 * @openapi
 * /delivery-person/verify:
 *   post:
 *     tags:
 *       - DeliveryPerson
 *     summary: Send Verify Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verify token sent
 */
router.post("/verify", sendVerifyTokenDeliveryPerson);

/**
 * @openapi
 * /delivery-person/reset-token/{token}:
 *   post:
 *     tags:
 *       - DeliveryPerson
 *     summary: Reset Password via Token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/reset-token/:token", resetPasswordDeliveryPerson);

/**
 * @openapi
 * /delivery-person/reset:
 *   post:
 *     tags:
 *       - DeliveryPerson
 *     summary: Send Reset Password Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset token sent
 */
router.post("/reset", sendResetPasswordTokenDeliveryPerson);

/**
 * @openapi
 * /delivery-person/update-document:
 *   put:
 *     tags:
 *       - DeliveryPerson
 *     summary: Update Delivery Person Documents
 *     requestBody:
 *       required: true
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
 *     responses:
 *       200:
 *         description: Documents updated successfully
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
