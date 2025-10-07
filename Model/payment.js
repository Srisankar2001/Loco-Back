import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const Payment = db.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'payment',
  timestamps: true
});

export default Payment;
