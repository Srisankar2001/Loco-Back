import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const Route = db.define('Route', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'route',
    timestamps: true
});

export default Route;
