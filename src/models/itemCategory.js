import { DataTypes } from "sequelize";
import db from "../config/db.js";

const itemCategory = db.define(
  "itemCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "itemCategory",
    timestamps: true,
  },
);

// itemCategory.associate = (models) => {
//   itemCategory.hasMany(models.defaultItem, {
//     foreignKey: "categoryId",
//     as: "items",
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
// };

export default itemCategory;
