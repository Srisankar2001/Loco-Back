import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { DOCUMENT } from "../enum/Document.js";

const PickupPersonDocument = db.define(
  "PickupPersonDocument",
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
        DOCUMENT.VECHILE_PICTURE,
        DOCUMENT.VECHILE_DOCUMENT,
      ),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "pickup_person_document",
    timestamps: true,
  },
);

export default PickupPersonDocument;
