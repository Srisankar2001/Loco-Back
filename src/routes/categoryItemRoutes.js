import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createMultipleItemCategories,
  getItemCategories,
  getItemCategoryById,
  hardDeleteItemCategory,
} from "../controllers/itemCategoryController.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router();

// const uploadDir = "C:\\locomunch\\items\\itemCategories";

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
 * /api/categoryItems:
 *   post:
 *     tags:
 *       - CategoryItems
 *     summary: Create multiple item categories
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - itemCategories
 *               - images
 *             properties:
 *               itemCategories:
 *                 type: string
 *                 description: JSON stringified array of category objects with `name`, optional `description`, and optional `isAvailable`.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post("/", upload.array("images"), createMultipleItemCategories);

/**
 * @openapi
 * /api/categoryItems:
 *   get:
 *     tags:
 *       - CategoryItems
 *     summary: Get all item categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", getItemCategories);

/**
 * @openapi
 * /api/categoryItems/{id}:
 *   get:
 *     tags:
 *       - CategoryItems
 *     summary: Get item category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category data
 */
router.get("/:id", getItemCategoryById);

/**
 * @openapi
 * /api/categoryItems/{id}:
 *   delete:
 *     tags:
 *       - CategoryItems
 *     summary: Hard delete a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/:id", hardDeleteItemCategory);

export default router;
