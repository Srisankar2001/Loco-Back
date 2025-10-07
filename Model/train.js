import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const Train = db.define('Train', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'train',
  timestamps: true
});

export default Train;
