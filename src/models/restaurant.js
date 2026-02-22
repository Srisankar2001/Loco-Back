import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Restaurant = db.define('Restaurant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locationLongitude: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locationLatitude: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'restaurant',
  timestamps: true
});

export default Restaurant;
