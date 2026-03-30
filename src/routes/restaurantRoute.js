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
 * /restaurant/register:
 *   post:
 *     tags:
 *       - Restaurant
 *     summary: Register Restaurant
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
 *               restaurantDocument:
 *                 type: string
 *                 format: binary
 *               image:
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
    { name: "restaurantDocument", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  registerRestaurant,
);

/**
 * @openapi
 * /restaurant/login:
 *   post:
 *     tags:
 *       - Restaurant
 *     summary: Login Restaurant
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
router.post("/login", loginRestaurant);

/**
 * @openapi
 * /restaurant/verify-token/{token}:
 *   post:
 *     tags:
 *       - Restaurant
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
router.post("/verify-token/:token", verifyRestaurant);

/**
 * @openapi
 * /restaurant/verify:
 *   post:
 *     tags:
 *       - Restaurant
 *     summary: Send Verify Token
 *     responses:
 *       200:
 *         description: Verify token sent
 */
router.post("/verify", sendVerifyTokenRestaurant);

/**
 * @openapi
 * /restaurant/reset-token/{token}:
 *   post:
 *     tags:
 *       - Restaurant
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
router.post("/reset-token/:token", resetPasswordRestaurant);

/**
 * @openapi
 * /restaurant/reset:
 *   post:
 *     tags:
 *       - Restaurant
 *     summary: Send Reset Password Token
 *     responses:
 *       200:
 *         description: Reset token sent
 */
router.post("/reset", sendResetPasswordTokenRestaurant);

/**
 * @openapi
 * /restaurant/update-document:
 *   put:
 *     tags:
 *       - Restaurant
 *     summary: Update Restaurant Documents
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
 *               restaurantDocument:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Documents updated successfully
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
