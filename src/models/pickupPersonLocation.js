import { DataTypes } from "sequelize";
import db from "../config/db.js";

const PickupPersonLocation = db.define(
  "PickupPersonLocation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pickupPersonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    }
  },
  {
    tableName: "pickup_person_location",
    timestamps: true,
  },
);

export default PickupPersonLocation;