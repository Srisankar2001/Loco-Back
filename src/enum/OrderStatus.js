export const ORDER_STATUS = Object.freeze({
  PENDING: "PENDING",           // Order placed by customer
  REJECTED: "REJECTED",         // Order rejected by restaurant
  ACCEPTED: "ACCEPTED",         // Order accepted by restaurant
  ASSIGNED: "ASSIGNED",         // Pickup person assigned but not picked up yet
  PICKEDUP: "PICKEDUP",         // Picked up by pickup person from restaurant
  HANDED_OVER: "HANDED_OVER",   // Pickup person handed over to delivery person
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY", // Delivery person on the way to customer
  DELIVERED: "DELIVERED",       // Delivered to customer
  CANCELLED: "CANCELLED",       // Cancelled by customer
});