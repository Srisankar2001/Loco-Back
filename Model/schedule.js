import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const Schedule = db.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'schedule',
  timestamps: false
});

export default Schedule;
