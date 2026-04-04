import { DataTypes } from 'sequelize';
import db from '../config/db.js';


const defaultItem = db.define('defaultItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
 
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "itemCategory", // tableName
        key: "id",
      },
    },

  isAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:true
  },

}, 
{
  tableName: 'defaultItem',
  timestamps: true
}
)
;
// defaultItem.associate = (models) => {
//   defaultItem.belongsTo(models.itemCategory, {
//     foreignKey: "categoryId",
//     as: "category",
//   });
// };
export default defaultItem;
