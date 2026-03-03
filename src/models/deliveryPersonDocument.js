import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { STATUS } from "../enum/Status.js";

const DeliveryPersonDocument = db.define(
  "DeliveryPersonDocument",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userPicture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userPictureStatus: {
      type: DataTypes.ENUM(STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED),
      defaultValue: STATUS.PENDING,
    },
    userPictureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userDocument: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userDocumentStatus: {
      type: DataTypes.ENUM(STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED),
      defaultValue: STATUS.PENDING,
    },
    userDocumentReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "delivery_person_document",
    timestamps: true,
  },
);

export default DeliveryPersonDocument;
