import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Line = db.define(
  "Line",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "Line",
    timestamps: true,
  },
);

export default Line;
