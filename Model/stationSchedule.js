import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const StationSchedule = db.define('StationSchedule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  arrivalTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  arrivalDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  departureTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  stationOrder: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'station_Schedule',
  timestamps: false
});

export default StationSchedule;
