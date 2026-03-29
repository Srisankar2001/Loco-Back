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

/**
 * @openapi
 * tags:
 *   name: Restaurants
 *   description: Restaurant management and authentication
 */

/**
 * @openapi
 * /restaurant/register:
 *   post:
 *     tags: [Restaurants]
 *     summary: Register a new restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, address, email, phoneNumber, password]
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               email: { type: string }
 *               phoneNumber: { type: string }
 *               password: { type: string }
 *               userPicture: { type: string, format: binary }
 *               userDocument: { type: string, format: binary }
 *               restaurantDocument: { type: string, format: binary }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Restaurant registered successfully
 */
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

/**
 * @openapi
 * /restaurant/login:
 *   post:
 *     tags: [Restaurants]
 *     summary: Restaurant login
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: string, description: 'JWT Token' }
 */
router.post("/login", loginRestaurant);

/**
 * @openapi
 * /restaurant/verify-token/{token}:
 *   post:
 *     tags: [Restaurants]
 *     summary: Verify restaurant email token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post("/verify-token/:token", verifyRestaurant);

/**
 * @openapi
 * /restaurant/verify:
 *   post:
 *     tags: [Restaurants]
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
router.post("/verify", sendVerifyTokenRestaurant);

/**
 * @openapi
 * /restaurant/reset-token/{token}:
 *   post:
 *     tags: [Restaurants]
 *     summary: Reset restaurant password with token
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
router.post("/reset-token/:token", resetPasswordRestaurant);

/**
 * @openapi
 * /restaurant/reset:
 *   post:
 *     tags: [Restaurants]
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
router.post("/reset", sendResetPasswordTokenRestaurant);

/**
 * @openapi
 * /restaurant/update-document:
 *   put:
 *     tags: [Restaurants]
 *     summary: Update restaurant documents
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
 *               restaurantDocument: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Documents updated
 */
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
