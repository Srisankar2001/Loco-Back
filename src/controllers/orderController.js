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

// User | Create a new order
export const createOrder = async (req, res) => {
  try {
    const { seatNumber, userId, trainId, stationId, restaurantId, orderedItems } = req.body;
    // orderItem = [{id,quantity}]
    if (
      !seatNumber ||
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
        where: { id: orderedItem.id, restaurantId },
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

    const transaction = await db.transaction();
    const order = await Order.create(
      {
        seatNumber,
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

    return res.status(201).json(successResponse("Order created successfully.", { orderId: order.id }));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// User | Cancel an order
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

     if (order.status !== ORDER_STATUS.PENDING) {
      return res.status(400).json(clientErrorResponse("Order can only be cancelled when pending."));
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

// Restaurant | Reject an order
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

// Restaurant | Accept an order
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

     if (order.status !== ORDER_STATUS.PENDING) {
      return res.status(400).json(clientErrorResponse("Order can only be accepted when pending."));
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

// Pickup Person | Claim all accepted orders for a restaurant, train and station
export const claimOrder = async (req, res) => {
  try {
    const { orderId, pickupPersonId, restaurantId, trainId, stationId } = req.body;
    if (!orderId || !pickupPersonId || !restaurantId || !trainId || !stationId) {
      return res.status(400).json(clientErrorResponse("All fields are required."));
    }

    const pickupPerson = await PickupPerson.findByPk(pickupPersonId);
    if (!pickupPerson) {
      return res.status(400).json(clientErrorResponse("Pickup person not found."));
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

    const orders = await Order.findAll({
      where: { id: orderId, restaurantId, trainId, stationId, status: ORDER_STATUS.ACCEPTED },
    });

    if (orders.length === 0) {
      return res.status(400).json(clientErrorResponse("No accepted orders found for this restaurant, train and station."));
    }

    // Check if already claimed by another pickup person
    const alreadyClaimed = orders.some(order => order.pickupPersonId !== null);
    if (alreadyClaimed) {
      return res.status(400).json(clientErrorResponse("Orders already claimed by another pickup person."));
    }

    const transaction = await db.transaction();
    await Order.update(
      { pickupPersonId, assignedAt: new Date(), status: ORDER_STATUS.ASSIGNED },
      { where: { id: orderId, restaurantId, trainId, stationId, status: ORDER_STATUS.ACCEPTED }, transaction },
    );
    await transaction.commit();
console.log("Orders claimed successfully.");
    return res.status(200).json(successResponse("Orders claimed successfully."));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Pickup Person | Cancel all assigned orders for a restaurant, train and station
export const cancelOrderByPickupPerson = async (req, res) => {
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
        .json(clientErrorResponse("Pickup person not found."));
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

    const orders = await Order.findAll({
      where: {
        pickupPersonId,
        restaurantId,
        trainId,
        stationId,
        status: ORDER_STATUS.ASSIGNED,
      },
    });
    if (orders.length === 0) {
      return res
        .status(400)
        .json(clientErrorResponse("No assigned orders found to cancel."));
    }

    const transaction = await db.transaction();
    await Order.update(
      { cancelledAt: new Date(), status: ORDER_STATUS.CANCELLED },
      {
        where: {
          pickupPersonId,
          restaurantId,
          trainId,
          stationId,
          status: ORDER_STATUS.ASSIGNED,
        },
        transaction,
      },
    );
    await transaction.commit();

    return res
      .status(200)
      .json(successResponse("Orders cancelled successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Pickup Person | Pickup all assigned orders for a restaurant, train and station
export const pickupOrder = async (req, res) => {
  try {
    const { orderId, pickupPersonId, restaurantId, trainId, stationId } = req.body;
    if (!orderId || !pickupPersonId || !restaurantId || !trainId || !stationId) {
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

    const orders = await Order.findAll({
      where: {
        id: orderId,
        pickupPersonId,
        restaurantId,
        trainId,
        stationId,
        status: ORDER_STATUS.ASSIGNED,
      },
    });
    if (orders.length === 0) {
      return res
        .status(400)
        .json(
          clientErrorResponse(
            "No assigned orders found for this restaurant, train and station.",
          ),
        );
    }

    const transaction = await db.transaction();
    await Order.update(
      { pickedupAt: new Date(), status: ORDER_STATUS.PICKEDUP },
      {
        where: {
          id: orderId,
          pickupPersonId,
          restaurantId,
          trainId,
          stationId,
          status: ORDER_STATUS.ASSIGNED,
        },
        transaction,
      },
    );
    await transaction.commit();

    return res
      .status(200)
      .json(successResponse("Orders picked up successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Pickup Person | Handover all pickedup orders
export const handoverOrder = async (req, res) => {
  try {
    const { pickupPersonId, restaurantId, trainId, stationId } = req.body;
    if (!pickupPersonId || !restaurantId || !trainId || !stationId) {
      return res.status(400).json(clientErrorResponse("All fields are required."));
    }

    const pickupPerson = await PickupPerson.findByPk(pickupPersonId);
    if (!pickupPerson) {
      return res.status(400).json(clientErrorResponse("Pickup person not found."));
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

    const orders = await Order.findAll({
      where: { pickupPersonId, restaurantId, trainId, stationId, status: ORDER_STATUS.PICKEDUP },
    });
    if (orders.length === 0) {
      return res.status(400).json(clientErrorResponse("No pickedup orders found to hand over."));
    }

    const transaction = await db.transaction();
    await Order.update(
      { handedOverAt: new Date(), status: ORDER_STATUS.HANDED_OVER },
      { where: { pickupPersonId, restaurantId, trainId, stationId, status: ORDER_STATUS.PICKEDUP }, transaction },
    );
    await transaction.commit();

    return res.status(200).json(successResponse("Orders handed over successfully."));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Delivery Person | Claim all handed over orders for a train and station
export const claimDeliveryOrder = async (req, res) => {
  try {
    const { orderId, deliveryPersonId, trainId, stationId } = req.body;
    if (!orderId || !deliveryPersonId || !trainId || !stationId) {
      return res.status(400).json(clientErrorResponse("All fields are required."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(deliveryPersonId);
    if (!deliveryPerson) {
      return res.status(400).json(clientErrorResponse("Delivery person not found."));
    }

    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(400).json(clientErrorResponse("Train not found."));
    }

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(400).json(clientErrorResponse("Station not found."));
    }

    const orders = await Order.findAll({
      where: { id: orderId, trainId, stationId, status: ORDER_STATUS.HANDED_OVER },
    });
    if (orders.length === 0) {
      return res.status(400).json(clientErrorResponse("No handed over order found for this train and station."));
    }

    const alreadyClaimed = orders.some(order => order.deliveryPersonId !== null);
    if (alreadyClaimed) {
      return res.status(400).json(clientErrorResponse("Orders already claimed by another delivery person."));
    }

    const transaction = await db.transaction();
    await Order.update(
      { deliveryPersonId, outForDeliveryAt: new Date(), status: ORDER_STATUS.OUT_FOR_DELIVERY },
      { where: { id: orderId, trainId, stationId, status: ORDER_STATUS.HANDED_OVER }, transaction },
    );
    await transaction.commit();

    return res.status(200).json(successResponse("Orders claimed successfully."));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Delivery Person | Mark a single order as delivered
export const deliveryOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }

    const { deliveryPersonId } = req.body;
    if (!deliveryPersonId) {
      return res.status(400).json(clientErrorResponse("All fields are required."));
    }

    const deliveryPerson = await DeliveryPerson.findByPk(deliveryPersonId);
    if (!deliveryPerson) {
      return res.status(400).json(clientErrorResponse("Delivery person not found."));
    }

    const order = await Order.findOne({
      where: { id: orderId, deliveryPersonId, status: ORDER_STATUS.OUT_FOR_DELIVERY },
    });
    if (!order) {
      return res.status(400).json(clientErrorResponse("Order not found."));
    }

    order.deliveredAt = new Date();
    order.status = ORDER_STATUS.DELIVERED;
    await order.save();

    return res.status(200).json(successResponse("Order delivered successfully."));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// User | Get a single order
export const getOrderForUser = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json(clientErrorResponse("User ID is required."));
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
          include: [{ model: Item, as: "item" }],
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

// User | Get all orders
export const getAllOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.query;
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
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Item, as: "item" }],
        },
        { model: Restaurant, as: "restaurant" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
        { model: User, as: "user" },
                { model: PickupPerson, as: "pickupPerson" },
                { model: DeliveryPerson, as: "deliveryPerson" },
      ],
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

// Restaurant | Get a single order
export const getOrderForRestaurant = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { restaurantId } = req.query;
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
          include: [{ model: Item, as: "item" }],
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

// Restaurant | Get all orders
export const getAllOrdersForRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!restaurantId) {
      return res
        .status(400)
        .json(clientErrorResponse("All fields are required."));
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(400).json(clientErrorResponse("Restaurant not found."));
    }

    const orders = await Order.findAll({ where: { restaurantId } });

    return res
      .status(200)
      .json(successResponse("Orders fetched successfully.", orders));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Restaurant | Get all orders by status
export const getOrdersForRestaurantByStatus = async (req, res) => {
  try {
    const { restaurantId, status } = req.params;

    if (!restaurantId || Number.isNaN(Number(restaurantId))) {
      return res
        .status(400)
        .json(clientErrorResponse("Valid restaurant ID is required."));
    }

    if (!status) {
      return res
        .status(400)
        .json(clientErrorResponse("Order status is required."));
    }

    const normalizedStatus = status.toUpperCase();

    if (!Object.values(ORDER_STATUS).includes(normalizedStatus)) {
      return res
        .status(400)
        .json(clientErrorResponse("Invalid order status."));
    }

    const restaurant = await Restaurant.findByPk(Number(restaurantId));
    if (!restaurant) {
      return res.status(404).json(clientErrorResponse("Restaurant not found."));
    }

    const orders = await Order.findAll({
      where: {
        restaurantId: Number(restaurantId),
        status: normalizedStatus,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Item, as: "item" }],
        },
        { model: Restaurant, as: "restaurant" },
        { model: User, as: "user" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
      ],
      order: [["createdAt", "DESC"]],
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

// Pickup Person | Get a single order
export const getOrderForPickupPerson = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { pickupPersonId } = req.query;
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
          include: [{ model: Item, as: "item" }],
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

// Pickup Person | Get all orders
export const getAllOrdersForPickupPerson = async (req, res) => {
  try {
    const { pickupPersonId } = req.query;
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

    const orders = await Order.findAll({ where: { pickupPersonId } });

    return res
      .status(200)
      .json(successResponse("Orders fetched successfully.", orders));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

// Delivery Person | Get a single order
export const getOrderForDeliveryPerson = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json(clientErrorResponse("Order ID is required."));
    }
    const { deliveryPersonId } = req.query;
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
          include: [{ model: Item, as: "item" }],
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

// Delivery Person | Get all orders
export const getAllOrdersForDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.query;
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

    const orders = await Order.findAll({ where: { deliveryPersonId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Item, as: "item" }],
        },
        { model: Restaurant, as: "restaurant" },
        { model: User, as: "user" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
      ],
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

// Admin | Get a single order
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
          include: [{ model: Item, as: "item" }],
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

// Admin | Get all orders
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

// Get all orders by status only
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res
        .status(400)
        .json(clientErrorResponse("Order status is required."));
    }

    const normalizedStatus = status.toUpperCase();

    if (!Object.values(ORDER_STATUS).includes(normalizedStatus)) {
      return res
        .status(400)
        .json(clientErrorResponse("Invalid order status."));
    }

    const orders = await Order.findAll({
      where: { status: normalizedStatus },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Item, as: "item" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
        { model: Train, as: "train" },
        { model: Station, as: "station" },
      ],
      order: [["createdAt", "DESC"]],
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
