import { DataTypes } from "sequelize";
import db from "../config/db.js";

const SearchIndex = db.define(
  "SearchIndex",
  {
    itemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    itemName: DataTypes.STRING,
    itemImage: DataTypes.STRING,
    itemDescription: DataTypes.STRING,
    itemPrice: DataTypes.DOUBLE,
    categoryId: DataTypes.INTEGER,
    categoryName: DataTypes.STRING,
    restaurantId: DataTypes.INTEGER,
    restaurantName: DataTypes.STRING,
    restaurantImage: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
  },
  {
    tableName: "search_index",
    timestamps: false,
    freezeTableName: true,
  },
);

// Prevent Sequelize from trying to create a backing table for the view.
SearchIndex.sync = async () => SearchIndex;

export default SearchIndex;
