import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const Review = db.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  reply: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'review',
  timestamps: true
});

export default Review;
