import itemCategory from "../models/itemCategory.js";
import fs from "fs";
import path from "path";

//Creation
export const createMultipleItemCategories = async (req, res) => {
  try {
    const itemCategoriesData = req.body.itemCategories
      ? JSON.parse(req.body.itemCategories)
      : [];
    const files = req.files || [];

    if (!itemCategoriesData || itemCategoriesData.length === 0) {
      return res.status(400).json({ message: "No item categories provided" });
    }

    if (files.length !== itemCategoriesData.length) {
      return res.status(400).json({
        message: "Mismatch between number of items categories and images",
      });
    }

    const createdItemCategories = [];

    // Process each item and its corresponding file
    for (let i = 0; i < itemCategoriesData.length; i++) {
      const item = itemCategoriesData[i];
      const file = files[i];

      // Get extension
      const ext = path.extname(file.originalname);
      // New filename is the item name + extension
      const newFilename = `${item.name}${ext}`;
      const newPath = path.join(file.destination, newFilename);

      // Rename the file
      fs.renameSync(file.path, newPath);

      // Create item in database
      const newItemCategory = await itemCategory.create({
        name: item.name,
        description: item.description,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        image: newPath, // Store the absolute path or relative path based on requirement
      });

      createdItemCategories.push(newItemCategory);
    }

    return res.status(201).json({
      message: "Item categories created successfully",
      data: createdItemCategories,
    });
  } catch (error) {
    console.error("Error creating multiple item categories:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//Get
export const getItemCategories = async (req, res) => {
  try {
    const categories = await itemCategory.findAll({
      where: {
        isAvailable: true,
      },
    });

    return res.status(200).json({
      message: "Item categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching item categories:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//Delete
export const hardDeleteItemCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await itemCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Item category not found" });
    }

    // Delete image file if exists
    if (category.image && fs.existsSync(category.image)) {
      fs.unlinkSync(category.image);
    }

    // Hard delete from database
    await category.destroy();

    return res.status(200).json({
      message: "Item category permanently deleted successfully",
    });
  } catch (error) {
    console.error("Error permanently deleting item category:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//Get By Id
export const getItemCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await itemCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Item category not found" });
    }

    return res.status(200).json({
      message: "Item category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching item category:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
