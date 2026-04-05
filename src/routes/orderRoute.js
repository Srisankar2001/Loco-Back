import express from "express";
import {
  acceptOrder,
  cancelOrder,
  cancelOrderByPickupPerson,
  claimDeliveryOrder,
  claimOrder,
  createOrder,
  deliveryOrder,
  getAllOrdersForAdmin,
  getAllOrdersForDeliveryPerson,
  getAllOrdersForPickupPerson,
  getAllOrdersForRestaurant,
  getOrdersForRestaurantByStatus,
  getAllOrdersForUser,
  getOrderForAdmin,
  getOrderForDeliveryPerson,
  getOrderForPickupPerson,
  getOrderForRestaurant,
  getOrderForUser,
  handoverOrder,
  pickupOrder,
  rejectOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// User
/**
 * @openapi
 * /order/create:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seatNumber
 *               - userId
 *               - trainId
 *               - stationId
 *               - restaurantId
 *               - orderedItems
 *             properties:
 *               seatNumber:
 *                 type: string
 *               userId:
 *                 type: integer
 *               trainId:
 *                 type: integer
 *               stationId:
 *                 type: integer
 *               restaurantId:
 *                 type: integer
 *               orderedItems:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - quantity
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/create", createOrder);

/**
 * @openapi
 * /order/cancel/{orderId}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Cancel a pending order as user
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.put("/cancel/:orderId", cancelOrder);

/**
 * @openapi
 * /order/user/get/{userId}/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a single order for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order fetched successfully
 */
router.get("/user/get/:userId/:orderId", getOrderForUser);

/**
 * @openapi
 * /order/user/get:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/user/get", getAllOrdersForUser);

// Admin
/**
 * @openapi
 * /order/admin/get/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a single order for admin
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order fetched successfully
 */
router.get("/admin/get/:orderId", getOrderForAdmin);

/**
 * @openapi
 * /order/admin/get:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for admin
 *     parameters:
 *       - in: query
 *         name: adminId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/admin/get", getAllOrdersForAdmin);

// Restaurant
/**
 * @openapi
 * /order/reject/{orderId}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Reject an order as restaurant
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order rejected successfully
 */
router.put("/reject/:orderId", rejectOrder);

/**
 * @openapi
 * /order/accept/{orderId}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Accept a pending order as restaurant
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order accepted successfully
 */
router.put("/accept/:orderId", acceptOrder);

/**
 * @openapi
 * /order/restaurant/get/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a single order for a restaurant
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order fetched successfully
 */
router.get("/restaurant/get/:orderId", getOrderForRestaurant);

/**
 * @openapi
 * /order/restaurant/get-by-status/{restaurantId}/{status}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get restaurant orders filtered by status
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PENDING, REJECTED, ACCEPTED, ASSIGNED, PICKEDUP, HANDED_OVER, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       400:
 *         description: Invalid restaurant ID or order status
 *       404:
 *         description: Restaurant not found
 */
router.get("/restaurant/get-by-status/:restaurantId/:status", getOrdersForRestaurantByStatus);

/**
 * @openapi
 * /order/restaurant/get:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for a restaurant
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/restaurant/get/:restaurantId", getAllOrdersForRestaurant);

// Pickup Person
/**
 * @openapi
 * /order/claim-pickup:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Claim accepted orders for pickup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupPersonId
 *               - restaurantId
 *               - trainId
 *               - stationId
 *             properties:
 *               pickupPersonId:
 *                 type: integer
 *               restaurantId:
 *                 type: integer
 *               trainId:
 *                 type: integer
 *               stationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Orders claimed successfully
 */
router.put("/claim-pickup", claimOrder);

/**
 * @openapi
 * /order/pickup:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Mark assigned orders as picked up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupPersonId
 *               - restaurantId
 *               - trainId
 *               - stationId
 *             properties:
 *               pickupPersonId:
 *                 type: integer
 *               restaurantId:
 *                 type: integer
 *               trainId:
 *                 type: integer
 *               stationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Orders picked up successfully
 */
router.put("/pickup", pickupOrder);

/**
 * @openapi
 * /order/handover:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Hand over picked-up orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupPersonId
 *               - restaurantId
 *               - trainId
 *               - stationId
 *             properties:
 *               pickupPersonId:
 *                 type: integer
 *               restaurantId:
 *                 type: integer
 *               trainId:
 *                 type: integer
 *               stationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Orders handed over successfully
 */
router.put("/handover", handoverOrder);

/**
 * @openapi
 * /order/pickup-cancel:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Cancel assigned orders as pickup person
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupPersonId
 *               - restaurantId
 *               - trainId
 *               - stationId
 *             properties:
 *               pickupPersonId:
 *                 type: integer
 *               restaurantId:
 *                 type: integer
 *               trainId:
 *                 type: integer
 *               stationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Orders cancelled successfully
 */
router.put("/pickup-cancel", cancelOrderByPickupPerson);

/**
 * @openapi
 * /order/pickup/get/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a single order for a pickup person
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pickupPersonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order fetched successfully
 */
router.get("/pickup/get/:orderId", getOrderForPickupPerson);

/**
 * @openapi
 * /order/pickup/get:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for a pickup person
 *     parameters:
 *       - in: query
 *         name: pickupPersonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/pickup/get", getAllOrdersForPickupPerson);

// Delivery Person
/**
 * @openapi
 * /order/claim-delivery:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Claim handed-over orders for delivery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryPersonId
 *               - trainId
 *               - stationId
 *             properties:
 *               deliveryPersonId:
 *                 type: integer
 *               trainId:
 *                 type: integer
 *               stationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Orders claimed successfully
 */
router.put("/claim-delivery", claimDeliveryOrder);

/**
 * @openapi
 * /order/delivery/{orderId}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Mark an order as delivered
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryPersonId
 *             properties:
 *               deliveryPersonId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order delivered successfully
 */
router.put("/delivery/:orderId", deliveryOrder);

/**
 * @openapi
 * /order/delivery/get/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a single order for a delivery person
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: deliveryPersonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order fetched successfully
 */
router.get("/delivery/get/:orderId", getOrderForDeliveryPerson);

/**
 * @openapi
 * /order/delivery/get:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for a delivery person
 *     parameters:
 *       - in: query
 *         name: deliveryPersonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/delivery/get", getAllOrdersForDeliveryPerson);

export default router;
