import { DataTypes } from "sequelize";
import db from "../config/db.js";

const StationStop = db.define(
  "StationStop",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    arrivalTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    arrivalDayOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    departureDayOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stopOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "station_stop",
    timestamps: true,
  },
);

export default StationStop;
