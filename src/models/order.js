import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { ORDER_STATUS } from "../enum/OrderStatus.js";

const Order = db.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    orderedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pickedupAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    handedOverAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    outForDeliveryAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      allowNull: false,
      defaultValue: ORDER_STATUS.PENDING,
    },
  },
  {
    tableName: "order",
    timestamps: true,
  },
);

export default Order;
