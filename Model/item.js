import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const Item = db.define('Item', {
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
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'item',
  timestamps: true
});

export default Item;
