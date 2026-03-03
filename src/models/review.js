import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Review = db.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    max: 5,
    min: 0
  },
  comment: {
    type: DataTypes.STRING
  },
  reply: {
    type: DataTypes.STRING
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'review',
  timestamps: true
});
export default Review;
