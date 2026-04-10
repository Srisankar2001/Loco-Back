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
    stationId: DataTypes.INTEGER,
    stationName: DataTypes.STRING,
    trainId: DataTypes.INTEGER,
    scheduleId: DataTypes.INTEGER,
    scheduleDay: DataTypes.JSON,
  },
  {
    tableName: "search_index",
    timestamps: false,
    freezeTableName: true,
  },
);

SearchIndex.sync = async () => SearchIndex;

export default SearchIndex;