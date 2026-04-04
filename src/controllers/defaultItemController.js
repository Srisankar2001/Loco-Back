import defaultItem from "../models/defaultItem.js";
import fs from "fs";
import path from "path";
import itemCategory from "../models/itemCategory.js";
import {
  processUploadedImage,
  renameImage,
  cleanupUploadedFiles,
} from "../utils/imageUtils.js";

//Create
export const createMultipleDefaultItems = async (req, res) => {
  try {
    const itemsData = req.body.items ? JSON.parse(req.body.items) : [];
    const files = req.files || [];

    if (!itemsData || itemsData.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (files.length !== itemsData.length) {
      return res
        .status(400)
        .json({ message: "Mismatch between number of items and images" });
    }

    const createdItems = [];

    // Process each item and its corresponding file
    for (let i = 0; i < itemsData.length; i++) {
      const item = itemsData[i];
      const file = files[i];

      //Check if category exists
      const category = await itemCategory.findByPk(item.categoryId);

      if (!category) {
        cleanupUploadedFiles(req.files);
        return res.status(404).json({
          message: `Category ${item.categoryId} not found`,
        });
      }

      // Check if category is available (not soft deleted)
      if (!category.isAvailable) {
        cleanupUploadedFiles(req.files);
        return res.status(409).json({
          message: `Category ${item.categoryId} is not available`,
        });
      }

      const newPath = processUploadedImage(file, item.name);

      // Create item in database
      const newItem = await defaultItem.create({
        name: item.name,
        description: item.description,
        categoryId: item.categoryId,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        image: newPath,
      });

      createdItems.push(newItem);
    }

    return res.status(201).json({
      message: "Items created successfully",
      data: createdItems,
    });
  } catch (error) {
    console.error("Error creating multiple default items:", error);
    cleanupUploadedFiles(req.files);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//Get
export const getDefaultItems = async (req, res) => {
  try {
    const items = await defaultItem.findAll({
      where: {
        isAvailable: true,
      },
    });

    return res.status(200).json({
      message: "Default items fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error("Error fetching default items:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getDefaultItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({
        message: "categoryId query parameter is required",
      });
    }

    const parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
      return res.status(400).json({
        message: "categoryId must be a valid positive integer",
      });
    }

    const category = await itemCategory.findByPk(parsedCategoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (!category.isAvailable) {
      return res.status(409).json({
        message: "Category is not available",
      });
    }

    const items = await defaultItem.findAll({
      where: {
        categoryId: parsedCategoryId,
        isAvailable: true,
      },
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      message: "Default items fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error("Error fetching default items by category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Toggle isAvailable status for soft delete / restore
export const toggleDeletion = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await defaultItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Default item not found" });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    const message = item.isAvailable
      ? "Default item restored successfully"
      : "Default item deleted successfully";

    return res.status(200).json({
      message,
      data: item,
    });
  } catch (error) {
    console.error("Error toggling default item deletion status:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//Get by Id
export const getDefaultItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await defaultItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Default item not found" });
    }

    return res.status(200).json({
      message: "Default item fetched successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error fetching default item:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateDefaultItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await defaultItem.findByPk(id);
    if (!item) {
      cleanupUploadedFiles(req.files);
      return res.status(404).json({ message: "Default item not found" });
    }
    const oldImage = item.image;
    const newName = req.body.name || item.name;
    if (req.body.name) item.name = req.body.name;
    if (req.body.description) item.description = req.body.description;
    if (req.body.categoryId) item.categoryId = req.body.categoryId;
    if (req.body.isAvailable !== undefined)
      item.isAvailable = req.body.isAvailable;
    let newImagePath = item.image;
    // Handle new image upload
    if (req.files && req.files.length > 0) {
      newImagePath = processUploadedImage(req.files[0], newName, oldImage);
    }
    // Handle rename if name changed but no new image uploaded else
    if (req.body.name && req.body.name !== item.name) {
      const renamedPath = renameImage(oldImage, newName);
      if (renamedPath) newImagePath = renamedPath;
    }
    item.image = newImagePath;
    await item.save();
    return res
      .status(200)
      .json({ message: "Default item updated successfully", data: item });
  } catch (error) {
    console.error("Error updating default item:", error);
    cleanupUploadedFiles(req.files);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
