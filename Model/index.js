import Admin from './admin.js';
import User from './user.js';
import PickupPerson from './pickupPerson.js';
import DeliveryPerson from './deliveryPerson.js';
import Restaurant from './restaurant.js';
import Item from './item.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Review from './review.js';
import Train from './train.js';
import Route from './route.js';
import Station from './station.js';
import Schedule from './schedule.js';
import RouteStation from './routeStation.js';
import StationSchedule from './stationSchedule.js';
import Payment from './payment.js';

Admin.hasMany(User, { foreignKey: 'adminId' });
User.belongsTo(Admin, { foreignKey: 'adminId' });

Admin.hasMany(PickupPerson, { foreignKey: 'adminId' });
PickupPerson.belongsTo(Admin, { foreignKey: 'adminId' });

Admin.hasMany(DeliveryPerson, { foreignKey: 'adminId' });
DeliveryPerson.belongsTo(Admin, { foreignKey: 'adminId' });

Admin.hasMany(Restaurant, { foreignKey: 'adminId' });
Restaurant.belongsTo(Admin, { foreignKey: 'adminId' });

Restaurant.hasMany(Item, { foreignKey: 'restaurantId' });
Item.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

OrderItem.belongsTo(Item, { foreignKey: 'itemId' });
Item.hasMany(OrderItem, { foreignKey: 'itemId' });

Review.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });

PickupPerson.hasMany(Order, { foreignKey: 'pickupPersonId' });
Order.belongsTo(PickupPerson, { foreignKey: 'pickupPersonId' });

DeliveryPerson.hasMany(Order, { foreignKey: 'deliveryPersonId' });
Order.belongsTo(DeliveryPerson, { foreignKey: 'deliveryPersonId' });

Order.belongsTo(Station, { as: 'station', foreignKey: 'stationId' });
Order.belongsTo(Train, { foreignKey: 'trainId' });

Train.belongsTo(Route, { foreignKey: 'routeId' });
Route.hasMany(Train, { foreignKey: 'routeId' });

Route.hasMany(RouteStation, { foreignKey: 'routeId' });
RouteStation.belongsTo(Route, { foreignKey: 'routeId' });

Station.hasMany(RouteStation, { foreignKey: 'stationId' });
RouteStation.belongsTo(Station, { foreignKey: 'stationId' });

Station.hasMany(StationSchedule, { foreignKey: 'stationId' });
StationSchedule.belongsTo(Station, { foreignKey: 'stationId' });

Schedule.hasMany(StationSchedule, { foreignKey: 'scheduleId' });
StationSchedule.belongsTo(Schedule, { foreignKey: 'scheduleId' });

export {
  Admin,
  User,
  PickupPerson,
  DeliveryPerson,
  Restaurant,
  Item,
  Order,
  OrderItem,
  Review,
  Train,
  Route,
  Station,
  Schedule,
  RouteStation,
  StationSchedule,
  Payment
};
