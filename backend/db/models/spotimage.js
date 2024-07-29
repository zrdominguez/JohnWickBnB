'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class spotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  spotImage.init({
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
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    }, {
    sequelize,
    modelName: 'spotImage',
  });
  return spotImage;
};
