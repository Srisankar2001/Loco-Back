import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createMultipleDefaultItems,
  getDefaultItems,
  getDefaultItemsByCategory,
  toggleDeletion,
  getDefaultItemById,
  updateDefaultItem,
} from "../controllers/defaultItemController.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router();

// const uploadDir = "C:\\locomunch\\items\\defultItems";

// // Ensure directory exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Generate a temporary filename, will be renamed in controller
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

/**
 * @openapi
 * /api/defaultItems/bulk:
 *   post:
 *     tags:
 *       - DefaultItems
 *     summary: Create multiple default items
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - images
 *             properties:
 *               items:
 *                 type: string
 *                 description: JSON stringified array of item objects with `name`, optional `description`, `categoryId`, and optional `isAvailable`.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post("/bulk", upload.array("images"), createMultipleDefaultItems);

/**
 * @openapi
 * /api/defaultItems/bulk:
 *   get:
 *     tags:
 *       - DefaultItems
 *     summary: Get default items
 *     responses:
 *       200:
 *         description: List of default items
 */
router.get("/bulk", getDefaultItems);

/**
 * @openapi
 * /api/defaultItems/category:
 *   get:
 *     tags:
 *       - DefaultItems
 *     summary: Get default items by category
 *     description: Returns all available default items for a valid and available category.
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID used to filter default items
 *     responses:
 *       200:
 *         description: Filtered default items fetched successfully
 *       400:
 *         description: Invalid or missing categoryId
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category is not available
 *       500:
 *         description: Internal server error
 */
router.get("/category", getDefaultItemsByCategory);

/**
 * @openapi
 * /api/defaultItems/{id}:
 *   get:
 *     tags:
 *       - DefaultItems
 *     summary: Get default item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Default item data
 */
router.get("/:id", getDefaultItemById);

// Toggle soft delete / restore
/**
 * @openapi
 * /api/defaultItems/{id}/toggle:
 *   patch:
 *     tags:
 *       - DefaultItems
 *     summary: Toggle soft delete status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Toggled successfully
 */
router.patch("/:id/toggle", toggleDeletion);

/**
 * @openapi
 * /api/defaultItems/{id}:
 *   put:
 *     tags:
 *       - DefaultItems
 *     summary: Update default item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put("/:id", upload.array("images"), updateDefaultItem);

export default router; 
