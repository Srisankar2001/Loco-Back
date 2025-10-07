import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const Order = db.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  orderedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  pickedupAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'order',
  timestamps: true
});

export default Order;
