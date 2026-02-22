import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const OrderItem = db.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
}, {
  tableName: 'order_item',
  timestamps: true
});

export default OrderItem;
