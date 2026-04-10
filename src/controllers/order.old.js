import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";
import { ORDER_STATUS } from "../enum/OrderStatus.js";
import OrderItem from "../models/orderItem.js";
import db from "../config/db.js";

const Order = model.Order;
const User = model.User;
const Restaurant = model.Restaurant;
const PickupPerson = model.PickupPerson;
const DeliveryPerson = model.DeliveryPerson;
const Item = model.Item;
const Train = model.Train;
const Station = model.Station;

export const createOrder = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { userId, trainId, stationId, restaurantId, orderedItems } = req.body;
    // orderItem = [{id,quantity}]
    if (
      !userId ||
      !restaurantId ||
      !orderedItems ||
      !Array.isArray(orderedItems) ||
      orderedItems.length == 0
    ) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json(clientErrorResponse("User not found."));
    }

    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(400).json(clientErrorResponse("Train not found."));
    }

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(400).json(clientErrorResponse("Station not found."));
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json(clientErrorResponse("Restaurant not found."));
    }

    let total = 0;
    const itemList = [];
    for (const orderedItem of orderedItems) {
      if (orderedItem.quantity <= 0) {
        return res
          .status(400)
          .json(clientErrorResponse("Item quantity is always positive."));
      }
      const item = await Item.findOne({
        where: {
          id: orderedItem.id,
          restaurantId: restaurantId,
        },
      });

      if (!item) {
        return res.status(400).json(clientErrorResponse("Item not found."));
      }

      itemList.push({
        id: item.id,
        price: item.price,
        quantity: orderedItem.quantity,
      });
      total += item.price * orderedItem.quantity;
    }

    const order = await Order.create(
      {
        userId,
        restaurantId,
        trainId,
        stationId,
        total,
        orderedAt: new Date(),
        status: ORDER_STATUS.PENDING,
      },
      { transaction },
    );

    for (const item of itemList) {
      await OrderItem.create(
        {
          orderId: order.id,
          itemId: item.id,
          quantity: item.quantity,
          price: item.price,
        },
        { transaction },
      );
    }

    await transaction.commit();
    return res.status(201).json(successResponse("Order created successfully."));
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Restaurant
export const rejectOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { restaurantId } = req.body;
    if (!restaurantId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json(clientErrorResponse("Restaurant not found."));
    }

    const order = await Order.findOne({ where: { id: orderId, restaurantId } });
    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    order.rejectedAt = new Date();
    order.status = ORDER_STATUS.REJECTED;

    await order.save();

    return res
      .status(200)
      .json(successResponse("Order rejected successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Restaurant
export const acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { restaurantId } = req.body;
    if (!restaurantId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json(clientErrorResponse("Restaurant not found."));
    }

    const order = await Order.findOne({ where: { id: orderId, restaurantId } });
    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    order.acceptedAt = new Date();
    order.status = ORDER_STATUS.ACCEPTED;

    await order.save();

    return res
      .status(200)
      .json(successResponse("Order accepted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// User
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json(clientErrorResponse("User not found."));
    }

    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    order.cancelledAt = new Date();
    order.status = ORDER_STATUS.CANCELLED;

    await order.save();

    return res
      .status(200)
      .json(successResponse("Order cancelled successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//pickup person
export const pickupOrder = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { pickupPersonId, restaurantId, trainId, stationId } = req.body;
    if (!pickupPersonId || !restaurantId || !trainId || !stationId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const pickupPerson = await PickupPerson.findByPk(pickupPersonId);
    if (!pickupPerson) {
      return res
        .status(400)
        .json(clientErrorResponse("Pickup Person not found."));
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json(clientErrorResponse("Restaurant not found."));
    }

    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(400).json(clientErrorResponse("Train not found."));
    }

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(400).json(clientErrorResponse("Station not found."));
    }

    await Order.update(
      {
        pickedupAt: new Date(),
        status: ORDER_STATUS.PICKEDUP,
          pickupPersonId,
      },
      {
        where: {
          restaurantId,
          trainId,
          stationId,
          status: ORDER_STATUS.ACCEPTED,
        },
        transaction,
      },
    );

    await transaction.commit();
    return res
      .status(200)
      .json(successResponse("Order picked up successfully."));
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// delivery person
export const deliveryOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { deliveryPersonId } = req.body;
    if (!deliveryPersonId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(deliveryPersonId);
    if (!deliveryPerson) {
      return res
        .status(400)
        .json(clientErrorResponse("Delivery Person not found."));
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    await Order.update(
      {
        deliveredAt: new Date(),
        status: ORDER_STATUS.DELIVERED,
        deliveryPersonId
      },
      { where: { id: orderId } },
    );

    return res
      .status(200)
      .json(successResponse("Order delivered successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get 1 order for user
export const getOrderForUser = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json(clientErrorResponse("User not found."));
    }

    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Item,
              as: "item",
            },
          ],
        },
        { model: Restaurant, as: "restaurant" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
        { model: User, as: "user" },
        { model: PickupPerson, as: "pickupPerson" },
        { model: DeliveryPerson, as: "deliveryPerson" },
      ],
    });
    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    return res
      .status(200)
      .json(successResponse("Order fetched successfully.", order));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get all orders for user
export const getAllOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json(clientErrorResponse("User not found."));
    }

    const orders = await Order.findAll({
      where: { userId },
    });

    return res
      .status(200)
      .json(successResponse("Orders fetched successfully.", orders));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get 1 order for restaturant
export const getOrderForRestaurant = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { restaurantId } = req.body;
    if (!restaurantId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json(clientErrorResponse("Restaurant not found."));
    }

    const order = await Order.findOne({
      where: { id: orderId, restaurantId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Item,
              as: "item",
            },
          ],
        },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
      ],
    });

    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    return res
      .status(200)
      .json(successResponse("Order fetched successfully.", order));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get all orders for restaurant
export const getAllOrdersForRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    if (!restaurantId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json(clientErrorResponse("Restaurant not found."));
    }

    const orders = await Order.findAll({
      where: { restaurantId },
    });

    return res
      .status(200)
      .json(successResponse("Orders fetched successfully.", orders));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get 1 order for pickup person
export const getOrderForPickupPerson = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { pickupPersonId } = req.body;
    if (!pickupPersonId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const pickupPerson = await PickupPerson.findByPk(pickupPersonId);
    if (!pickupPerson) {
      return res
        .status(400)
        .json(clientErrorResponse("Pickup person not found."));
    }

    const order = await Order.findOne({
      where: { id: orderId, pickupPersonId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Item,
              as: "item",
            },
          ],
        },
        { model: Restaurant, as: "restaurant" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
      ],
    });

    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    return res
      .status(200)
      .json(successResponse("Order fetched successfully.", order));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get all orders for pickup person
export const getAllOrdersForPickupPerson = async (req, res) => {
  try {
    const { pickupPersonId } = req.body;
    if (!pickupPersonId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const pickupPerson = await PickupPerson.findByPk(pickupPersonId);
    if (!pickupPerson) {
      return res
        .status(400)
        .json(clientErrorResponse("Pickup person not found."));
    }

    const orders = await Order.findAll({
      where: { pickupPersonId },
    });

    return res
      .status(200)
      .json(successResponse("Orders fetched successfully.", orders));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get 1 order for delivery person
export const getOrderForDeliveryPerson = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { deliveryPersonId } = req.body;
    if (!deliveryPersonId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(deliveryPersonId);
    if (!deliveryPerson) {
      return res
        .status(400)
        .json(clientErrorResponse("Delivery person not found."));
    }

    const order = await Order.findOne({
      where: { id: orderId, deliveryPersonId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Item,
              as: "item",
            },
          ],
        },
        { model: Restaurant, as: "restaurant" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
      ],
    });

    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    return res
      .status(200)
      .json(successResponse("Order fetched successfully.", order));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get all orders for delivery person
export const getAllOrdersForDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    if (!deliveryPersonId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(deliveryPersonId);
    if (!deliveryPerson) {
      return res
        .status(400)
        .json(clientErrorResponse("Delivery person not found."));
    }

    const orders = await Order.findAll({
      where: { deliveryPersonId },
    });

    return res
      .status(200)
      .json(successResponse("Orders fetched successfully.", orders));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get 1 order for admin
export const getOrderForAdmin = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Item,
              as: "item",
            },
          ],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
        { model: DeliveryPerson, as: "deliveryPerson" },
        { model: PickupPerson, as: "pickupPerson" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
      ],
    });
    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    return res
      .status(200)
      .json(successResponse("Order fetched successfully.", order));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

//get all order for admin
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const orders = await Order.findAll();

    return res
      .status(200)
      .json(successResponse("Orders fetched successfully.", orders));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};