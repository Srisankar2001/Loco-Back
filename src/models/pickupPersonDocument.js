import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { STATUS } from "../enum/Status.js";

const PickupPersonDocument = db.define(
  "PickupPersonDocument",
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
    vehiclePicture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    vehiclePictureStatus: {
      type: DataTypes.ENUM(STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED),
      defaultValue: STATUS.PENDING,
    },
    vehiclePictureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicleDocument: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    vehicleDocumentStatus: {
      type: DataTypes.ENUM(STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED),
      defaultValue: STATUS.PENDING,
    },
    vehicleDocumentReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "pickup_person_document",
    timestamps: true,
  },
);

export default PickupPersonDocument;
