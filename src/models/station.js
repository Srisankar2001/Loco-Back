import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Station = db.define('Station', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
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
  tableName: 'station',
  timestamps: false
});

export default Station;
