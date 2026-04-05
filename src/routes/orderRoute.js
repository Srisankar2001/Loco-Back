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
router.post("/create", createOrder);
router.put("/cancel/:orderId", cancelOrder);
router.get("/user/get/:orderId", getOrderForUser);
router.get("/user/get-all/:userId", getAllOrdersForUser);

// Admin
router.get("/admin/get/:orderId", getOrderForAdmin);
router.get("/admin/get-all/:adminId", getAllOrdersForAdmin);

// Restaurant
router.put("/reject/:orderId", rejectOrder);
router.put("/accept/:orderId", acceptOrder);
router.get("/restaurant/get/:orderId", getOrderForRestaurant);
router.get("/restaurant/get-all/:restaurantId", getAllOrdersForRestaurant);

// Pickup Person
router.put("/claim-pickup", claimOrder);
router.put("/pickup", pickupOrder);
router.put("/handover", handoverOrder);
router.put("/pickup-cancel", cancelOrderByPickupPerson);
router.get("/pickup/get/:orderId", getOrderForPickupPerson);
router.get("/pickup/get-all/:pickupPersonId", getAllOrdersForPickupPerson);

// Delivery Person
router.put("/claim-delivery", claimDeliveryOrder);
router.put("/delivery/:orderId", deliveryOrder);
router.get("/delivery/get/:orderId", getOrderForDeliveryPerson);
router.get("/delivery/get-all/:deliveryPersonId", getAllOrdersForDeliveryPerson);

export default router;
