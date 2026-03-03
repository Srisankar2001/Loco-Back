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
const router = express.Router();

const uploadDir = "C:\\locomunch\\items\\defultItems";

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

router.post("/bulk", upload.array("images"), createMultipleDefaultItems);
router.get("/bulk", getDefaultItems);
router.get("/:id", getDefaultItemById);
// Toggle soft delete / restore
router.patch("/:id/toggle", toggleDeletion);
router.put("/:id", upload.array("images"), updateDefaultItem);

export default router; 
