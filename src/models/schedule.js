import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Schedule = db.define(
  "Schedule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    day: {
      type: DataTypes.JSON,
      allowNull:false
    },
    dayOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "schedule",
    timestamps: true,
  },
);

export default Schedule;
