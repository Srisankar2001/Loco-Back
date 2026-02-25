import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { DOCUMENT } from "../enum/Document.js";

const RestaurantDocument = db.define(
  "RestaurantDocument",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(
        DOCUMENT.USER_PICTURE,
        DOCUMENT.USER_DOCUMENT,
        DOCUMENT.RESTAURANT_DOCUMENT,
      ),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "restaurant_document",
    timestamps: true,
  },
);

export default RestaurantDocument;
