import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";

const Item = model.Item;

export const createItem = async (req, res) => {
  try {
    const { name, price, description, availability, restaurantId } = req.body;
const image = req.files?.image?.[0]?.filename;

    if (!name || !price || !description || !restaurantId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const existingName = await Item.findOne({ where: { name, restaurantId } });
    if (existingName) {
      return res
        .status(400)
        .json(clientErrorResponse("Item name already exists."));
    }

    await Item.create({
      name,
      price,
      image,
      description,
      availability: availability ?? false,
      restaurantId,
    });

    return res.status(201).json(successResponse("Item created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const updateItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, price, description, availability, restaurantId } = req.body;

    if (!itemId) {
      return res.status(400).json(clientErrorResponse("Item ID is required."));
    }

    if (!name && !price && !description && availability === undefined) {
      return res
        .status(400)
        .json(clientErrorResponse("No data provided for update."));
    }

    const item = await Item.findOne({ where: { id: itemId, restaurantId } });
    if (!item) {
      return res.status(400).json(clientErrorResponse("Item not found."));
    }

    if (name && item.name !== name) {
      const existingName = await Item.findOne({ where: { name, restaurantId } });
      if (existingName) {
        return res
          .status(400)
          .json(clientErrorResponse("Item name already exists."));
      }
      item.name = name;
    }

     if (price && item.price !== price) item.price = price;
    if (description && item.description !== description) item.description = description;
    if (availability !== undefined && item.availability !== availability) item.availability = availability;

    await item.save();

    return res.status(200).json(successResponse("Item updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const {  restaurantId } = req.body;

    if (!itemId) {
      return res.status(400).json(clientErrorResponse("Item ID is required."));
    }

     const item = await Item.findOne({ where: { id: itemId, restaurantId } });
    if (!item) {
      return res.status(400).json(clientErrorResponse("Item not found."));
    }

    await item.destroy();

    return res.status(200).json(successResponse("Item deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const {  restaurantId } = req.body;

    if (!itemId) {
      return res.status(400).json(clientErrorResponse("Item ID is required."));
    }

    const item = await Item.findOne({ where: { id: itemId, restaurantId } });
    if (!item) {
      return res.status(400).json(clientErrorResponse("Item not found."));
    }

    return res
      .status(200)
      .json(successResponse("Item retrieved successfully.", item));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getAllItems = async (req, res) => {
  try {
    const {  restaurantId } = req.body;

    const items = await Item.findAll({ where: { restaurantId } });

    return res
      .status(200)
      .json(successResponse("Items retrieved successfully.", items));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};