'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(
        models.Spot,
        {
          foreignKey: 'imageableId',
          constraints: false,
          as: 'spot',
          scope: {
            imageableType: 'spot'
          }
        }
      )
      Image.belongsTo(
        models.Review,
        {
          foreignKey: 'imageableId',
          constraints: false,
          as: 'review',
          scope: {
            imageableType: 'review'
          }
        }
      )
    }
  }
  Image.init({
    imageableType: {
      type: DataTypes.ENUM('spot', 'review'),
      allowNull: false,
      validate: {
        notNull: { msg: 'Imageable type is required' },
        isIn: {
          args: [['spot', 'review']],
          msg: 'Imageable type must be either spot or review'
        }
      }
    },
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Imageable ID is required' },
        isInt: { msg: 'Imageable ID must be an integer' },
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'URL is required' },
        isUrl: { msg: 'URL must be a valid URL' },
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: { msg: 'Preview is required' },
        isBoolean(value){
          if(typeof value !== 'boolean'){
            throw new Error("Preview must be true or false");
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
