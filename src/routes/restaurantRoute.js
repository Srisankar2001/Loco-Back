import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  getRestaurantById,
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
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - email
 *               - phoneNumber
 *               - password
 *               - locationLongitude
 *               - locationLatitude
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               locationLongitude:
 *                 type: number
 *               locationLatitude:
 *                 type: number
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
router.post("/reset-token/:token", resetPasswordRestaurant);

/**
 * @openapi
 * /restaurant/reset:
 *   post:
 *     tags:
 *       - Restaurant
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
router.post("/reset", sendResetPasswordTokenRestaurant);

/**
 * @openapi
 * /restaurant/{restaurantId}:
 *   get:
 *     tags:
 *       - Restaurant
 *     summary: Get restaurant details by ID
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant fetched successfully
 *       400:
 *         description: Invalid restaurant ID
 *       404:
 *         description: Restaurant not found
 */
router.get("/:restaurantId", getRestaurantById);

/**
 * @openapi
 * /restaurant/update-document:
 *   put:
 *     tags:
 *       - Restaurant
 *     summary: Update Restaurant Documents
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
