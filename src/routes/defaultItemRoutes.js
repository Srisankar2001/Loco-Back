import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createMultipleDefaultItems,
  getDefaultItems,
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
 * tags:
 *   name: DefaultItems
 *   description: Management of default items in the catalog
 */

/**
 * @openapi
 * /api/defaultItems/bulk:
 *   post:
 *     tags: [DefaultItems]
 *     summary: Create multiple default items
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               items: { type: string, description: 'JSON string of items array' }
 *               images: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201:
 *         description: Items created
 */
router.post("/bulk", upload.array("images"), createMultipleDefaultItems);

/**
 * @openapi
 * /api/defaultItems/bulk:
 *   get:
 *     tags: [DefaultItems]
 *     summary: Get all available default items
 */
router.get("/bulk", getDefaultItems);

/**
 * @openapi
 * /api/defaultItems/{id}:
 *   get:
 *     tags: [DefaultItems]
 *     summary: Get a default item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 */
router.get("/:id", getDefaultItemById);

/**
 * @openapi
 * /api/defaultItems/{id}/toggle:
 *   patch:
 *     tags: [DefaultItems]
 *     summary: Toggle item availability (Soft Delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 */
router.patch("/:id/toggle", toggleDeletion);

/**
 * @openapi
 * /api/defaultItems/{id}:
 *   put:
 *     tags: [DefaultItems]
 *     summary: Update a default item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               categoryId: { type: integer }
 *               isAvailable: { type: boolean }
 *               images: { type: array, items: { type: string, format: binary } }
 */
router.put("/:id", upload.array("images"), updateDefaultItem);

export default router; 
