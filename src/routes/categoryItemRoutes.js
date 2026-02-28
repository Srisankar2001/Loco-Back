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
const router = express.Router();

const uploadDir = "C:\\locomunch\\items\\itemCategories";

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a temporary filename, will be renamed in controller
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.array("images"),
  createMultipleItemCategories,
);
router.get("/", getItemCategories);
router.get("/:id", getItemCategoryById);
router.delete("/:id", hardDeleteItemCategory);

export default router;
