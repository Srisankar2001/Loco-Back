import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Route = db.define(
  "Route",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isReverse: {
      type : DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    }
  },
  {
    tableName: "route",
    timestamps: true,
  },
);

export default Route;
