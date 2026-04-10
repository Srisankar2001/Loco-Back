import express from "express";
import {
  createItem,
  deleteItem,
  getAllItemsByRestaurantId,
  getAllItemsWithRestaurant,
  getItem,
  updateItem,
} from "../controllers/itemController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

/**
 * @openapi
 * /item/create:
 *   post:
 *     tags:
 *       - Items
 *     summary: Create a restaurant item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               availability:
 *                 type: boolean
 *                 default: false
 *               restaurantId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/create",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createItem,
);

/**
 * @openapi
 * /item/update/{itemId}:
 *   put:
 *     tags:
 *       - Items
 *     summary: Update a restaurant item
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: integer
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               availability:
 *                 type: boolean
 *             description: At least one updatable field besides `restaurantId` must be provided.
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Item not found or invalid request
 */
router.put("/update/:itemId", updateItem);

/**
 * @openapi
 * /item/delete/{itemId}:
 *   delete:
 *     tags:
 *       - Items
 *     summary: Delete a restaurant item
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       400:
 *         description: Item not found or invalid request
 */
router.delete("/delete/:itemId", deleteItem);

/**
 * @openapi
 * /item/get/{itemId}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Get a single restaurant item
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item retrieved successfully
 *       400:
 *         description: Item not found or invalid request
 */
router.get("/get/:itemId", getItem);

/**
 * @openapi
 * /item/get:
 *   get:
 *     tags:
 *       - Items
 *     summary: Get all active restaurant items with restaurant details
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 */
router.get("/get", getAllItemsWithRestaurant);

/**
 * @openapi
 * /item/get/restaurant/{restaurantId}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Get all items for a restaurant
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 */
router.get("/get/restaurant/:restaurantId", getAllItemsByRestaurantId);

export default router;
