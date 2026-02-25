import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { DOCUMENT } from "../enum/Document.js";

const DeliveryPersonDocument = db.define(
  "DeliveryPersonDocument",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(DOCUMENT.USER_PICTURE, DOCUMENT.USER_DOCUMENT),
      allowNull: false,
    },
    path:{
      type: DataTypes.STRING,
      allowNull:false
    }
  },
  {
    tableName: "delivery_person_document",
    timestamps: true,
  },
);

export default DeliveryPersonDocument;
