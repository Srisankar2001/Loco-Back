import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  getPickupPersonById,
  loginPickupPerson,
  registerPickupPerson,
  resetPasswordPickupPerson,
  sendResetPasswordTokenPickupPerson,
  sendVerifyTokenPickupPerson,
  updateDocumentPickupPerson,
  updateAvailabilityPickupPerson,
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
router.post("/reset-token/:token", resetPasswordPickupPerson);

/**
 * @openapi
 * /pickup-person/reset:
 *   post:
 *     tags:
 *       - PickupPerson
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
router.post("/reset", sendResetPasswordTokenPickupPerson);

/**
 * @openapi
 * /pickup-person/{pickupPersonId}:
 *   get:
 *     tags:
 *       - PickupPerson
 *     summary: Get pickup person details by ID
 *     parameters:
 *       - in: path
 *         name: pickupPersonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pickup person fetched successfully
 *       400:
 *         description: Invalid pickup person ID
 *       404:
 *         description: Pickup person not found
 */
router.get("/:pickupPersonId", getPickupPersonById);

/**
 * @openapi
 * /pickup-person/update-document:
 *   put:
 *     tags:
 *       - PickupPerson
 *     summary: Update Pickup Person Documents
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

/**
 * @openapi
 * /pickup-person/availability:
 *   put:
 *     tags:
 *       - PickupPerson
 *     summary: Update Pickup Person Availability
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - availability
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Pickup person ID
 *               availability:
 *                 type: integer
 *                 enum:
 *                   - 0
 *                   - 1
 *                 description: Set to 1 when available, 0 when unavailable
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       400:
 *         description: Invalid request body or availability already set
 *       401:
 *         description: Pickup person ID not provided
 *       404:
 *         description: Pickup person not found
 */
router.put(
  "/availability",
  updateAvailabilityPickupPerson,
);
export default router;
