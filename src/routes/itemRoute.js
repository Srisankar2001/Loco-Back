import express from "express";
import {
  createItem,
  deleteItem,
  getAllItems,
  getItem,
  updateItem,
} from "../controllers/itemController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/create",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createItem,
);

router.put("/update/:itemId", updateItem);

router.delete("/delete/:itemId", deleteItem);

router.get("/get/:itemId", getItem);
router.get("/get", getAllItems);

export default router;
