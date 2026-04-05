import Admin from "./admin.js";
import User from "./user.js";
import PickupPerson from "./pickupPerson.js";
import DeliveryPerson from "./deliveryPerson.js";
import Restaurant from "./restaurant.js";
import Item from "./item.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";
import Review from "./review.js";
import Train from "./train.js";
import Route from "./route.js";
import Line from "./line.js";
import Station from "./station.js";
import Schedule from "./schedule.js";
import LineStation from "./lineStation.js";
import StationStop from "./stationStop.js";
import Payment from "./payment.js";
import defaultItem from "./defaultItem.js";
import itemCategory from "./itemCategory.js";
import PickupPersonDocument from "./pickupPersonDocument.js";
import DeliveryPersonDocument from "./deliveryPersonDocument.js";
import RestaurantDocument from "./restaurantDocument.js";
import TrainLocation from "./trainLocation.js";
import PickupPersonLocation from "./pickupPersonLocation.js";

Admin.hasMany(User, { foreignKey: "adminId" });
User.belongsTo(Admin, { foreignKey: "adminId" });

Admin.hasMany(PickupPerson, { foreignKey: "adminId" });
PickupPerson.belongsTo(Admin, { foreignKey: "adminId" });

Admin.hasMany(DeliveryPerson, { foreignKey: "adminId" });
DeliveryPerson.belongsTo(Admin, { foreignKey: "adminId" });

Admin.hasMany(Restaurant, { foreignKey: "adminId" });
Restaurant.belongsTo(Admin, { foreignKey: "adminId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

OrderItem.belongsTo(Item, { foreignKey: "itemId" });
Item.hasMany(OrderItem, { foreignKey: "itemId" });

Review.belongsTo(Restaurant, { foreignKey: "restaurantId" });
Restaurant.hasMany(Review, { foreignKey: "restaurantId" });

Line.belongsTo(Station, { foreignKey: "startStationId", as: "startStation" });
Line.belongsTo(Station, { foreignKey: "endStationId", as: "endStation" });

Route.belongsTo(Line, { foreignKey: "lineId" });
Route.belongsTo(Station, { foreignKey: "startStationId", as: "startStation" });
Route.belongsTo(Station, { foreignKey: "endStationId", as: "endStation" });

Line.hasMany(LineStation, { foreignKey: "lineId" });
LineStation.belongsTo(Line, { foreignKey: "lineId" });

Station.hasMany(LineStation, { foreignKey: "stationId" });
LineStation.belongsTo(Station, { foreignKey: "stationId" });

Train.hasMany(Schedule, { foreignKey: "trainId" });
Schedule.belongsTo(Train, { foreignKey: "trainId" });

Route.hasMany(Schedule, { foreignKey: "routeId" });

Schedule.belongsTo(Route, { foreignKey: "routeId" });

Station.hasMany(StationStop, { foreignKey: "stationId", as: "stationStops" });
StationStop.belongsTo(Station, { foreignKey: "stationId", as: "station" });

// Schedule.hasMany(StationStop, { foreignKey: "scheduleId"});
// StationStop.belongsTo(Station, { foreignKey: "scheduleId" });

Schedule.hasMany(StationStop, { foreignKey: "scheduleId", as: "stops" });
StationStop.belongsTo(Schedule, { foreignKey: "scheduleId", as: "schedule" });

itemCategory.hasMany(defaultItem, { foreignKey: "categoryId" });
defaultItem.belongsTo(itemCategory, { foreignKey: "categoryId" });

itemCategory.hasMany(Item, { foreignKey: "categoryId" });
Item.belongsTo(itemCategory, { foreignKey: "categoryId" });

// User
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// Restaurant
Restaurant.hasMany(Order, { foreignKey: "restaurantId", as: "orders" });
Order.belongsTo(Restaurant, { foreignKey: "restaurantId", as: "restaurant" });

// Pickup
PickupPerson.hasMany(Order, { foreignKey: "pickupPersonId", as: "pickupOrders" });
Order.belongsTo(PickupPerson, { foreignKey: "pickupPersonId", as: "pickupPerson" });

// Delivery
DeliveryPerson.hasMany(Order, { foreignKey: "deliveryPersonId", as: "deliveryOrders" });
Order.belongsTo(DeliveryPerson, { foreignKey: "deliveryPersonId", as: "deliveryPerson" });

// Station
Station.hasMany(Order, { foreignKey: "stationId", as: "orders" });
Order.belongsTo(Station, { foreignKey: "stationId", as: "station" });

// Train
Train.hasMany(Order, { foreignKey: "trainId", as: "orders" });
Order.belongsTo(Train, { foreignKey: "trainId", as: "train" });

// Order Items
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

OrderItem.belongsTo(Item, { foreignKey: "itemId", as: "item" });
Item.hasMany(OrderItem, { foreignKey: "itemId", as: "orderItems" });

Restaurant.hasMany(Item, { foreignKey: "restaurantId" });
Item.belongsTo(Restaurant, { foreignKey: "restaurantId" });

Schedule.hasOne(TrainLocation, { foreignKey: "scheduleId" });
TrainLocation.belongsTo(Schedule, { foreignKey: "scheduleId" });

PickupPerson.hasOne(PickupPersonLocation, { foreignKey: "pickupPersonId" });
PickupPersonLocation.belongsTo(PickupPerson, { foreignKey: "pickupPersonId" });

PickupPerson.hasOne(PickupPersonDocument, { foreignKey: "pickupPersonId" });
PickupPersonDocument.belongsTo(PickupPerson, { foreignKey: "pickupPersonId" });

DeliveryPerson.hasOne(DeliveryPersonDocument, { foreignKey: "deliveryPersonId" });
DeliveryPersonDocument.belongsTo(DeliveryPerson, { foreignKey: "deliveryPersonId" });

Restaurant.hasOne(RestaurantDocument, { foreignKey: "restaurantId" });
RestaurantDocument.belongsTo(Restaurant, { foreignKey: "restaurantId" });

Station.hasMany(Restaurant, { foreignKey: "stationId" });
Restaurant.belongsTo(Station, { foreignKey: "stationId" });

export default {
  Admin,
  User,
  PickupPerson,
  DeliveryPerson,
  Restaurant,
  PickupPersonDocument,
  DeliveryPersonDocument,
  RestaurantDocument,
  Item,
  Order,
  OrderItem,
  Review,
  Train,
  Line,
  Route,
  Station,
  Schedule,
  LineStation,
  StationStop,
  Payment,
  defaultItem,
  itemCategory,
  TrainLocation,
  PickupPersonLocation
};
