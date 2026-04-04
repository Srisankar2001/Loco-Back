import express from "express";
import {
  getDeliveryPersonDocs,
  verifyDeliveryPersonDocument,
  getPickupPersonDocs,
  verifyPickupPersonDocument,
  getRestaurantDocs,
  verifyRestaurantDocument,
} from "../controllers/documentVerificationController.js";

const router = express.Router();

/**
 * @openapi
 * /doc/delivery/{id}:
 *   get:
 *     tags:
 *       - DocumentVerification
 *     summary: Get delivery person documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document fetched successfully
 *       404:
 *         description: Document not found
 */
router.get("/delivery/:id", getDeliveryPersonDocs);

/**
 * @openapi
 * /doc/delivery/{personId}/verify:
 *   put:
 *     tags:
 *       - DocumentVerification
 *     summary: Verify delivery person documents
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userPictureStatus
 *               - userDocumentStatus
 *             properties:
 *               userPictureStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               userPictureReason:
 *                 type: string
 *                 nullable: true
 *               userDocumentStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               userDocumentReason:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Documents verified successfully
 *       404:
 *         description: Delivery person or document not found
 */
router.put("/delivery/:personId/verify", verifyDeliveryPersonDocument);

/**
 * @openapi
 * /doc/pickup/{id}:
 *   get:
 *     tags:
 *       - DocumentVerification
 *     summary: Get pickup person documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document fetched successfully
 *       404:
 *         description: Document not found
 */
router.get("/pickup/:id", getPickupPersonDocs);

/**
 * @openapi
 * /doc/pickup/{personId}/verify:
 *   put:
 *     tags:
 *       - DocumentVerification
 *     summary: Verify pickup person documents
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userPictureStatus
 *               - userDocumentStatus
 *               - vehiclePictureStatus
 *               - vehicleDocumentStatus
 *             properties:
 *               userPictureStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               userPictureReason:
 *                 type: string
 *                 nullable: true
 *               userDocumentStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               userDocumentReason:
 *                 type: string
 *                 nullable: true
 *               vehiclePictureStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               vehiclePictureReason:
 *                 type: string
 *                 nullable: true
 *               vehicleDocumentStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               vehicleDocumentReason:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Documents verified successfully
 *       404:
 *         description: Pickup person or document not found
 */
router.put("/pickup/:personId/verify", verifyPickupPersonDocument);

/**
 * @openapi
 * /doc/restaurant/{id}:
 *   get:
 *     tags:
 *       - DocumentVerification
 *     summary: Get restaurant documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document fetched successfully
 *       404:
 *         description: Document not found
 */
router.get("/restaurant/:id", getRestaurantDocs);

/**
 * @openapi
 * /doc/restaurant/{restaurantId}/verify:
 *   put:
 *     tags:
 *       - DocumentVerification
 *     summary: Verify restaurant documents
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userPictureStatus
 *               - userDocumentStatus
 *               - restaurantDocumentStatus
 *             properties:
 *               userPictureStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               userPictureReason:
 *                 type: string
 *                 nullable: true
 *               userDocumentStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               userDocumentReason:
 *                 type: string
 *                 nullable: true
 *               restaurantDocumentStatus:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               restaurantDocumentReason:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Documents verified successfully
 *       404:
 *         description: Restaurant or document not found
 */
router.put("/restaurant/:restaurantId/verify", verifyRestaurantDocument);

export default router;
