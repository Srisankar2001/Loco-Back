import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { STATUS } from "../enum/Status.js";

const PickupPerson = db.define(
  "PickupPerson",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifyToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifyTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(STATUS)),
      allowNull: false,
      defaultValue: STATUS.PENDING,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "pickup_person",
    timestamps: true,
  },
);

export default PickupPerson;
