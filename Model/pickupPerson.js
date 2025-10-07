import { DataTypes } from 'sequelize';
import db from '../Database/db.js';

const PickupPerson = db.define('PickupPerson', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    availability:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'pickup_person',
    timestamps: true
});

export default PickupPerson;
