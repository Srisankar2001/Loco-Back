import { DataTypes } from "sequelize";
import db from "../config/db.js";

const LineStation = db.define(
  "LineStation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lineOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "line_station",
    timestamps: true,
  },
);

export default LineStation;
