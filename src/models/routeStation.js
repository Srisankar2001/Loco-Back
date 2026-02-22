import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const RouteStation = db.define('RouteStation', {
  stopOrder: {
    type: DataTypes.INTEGER,
    allowNull:false
  }
}, {
  tableName: 'route_station',
  timestamps: false
});

export default RouteStation;
