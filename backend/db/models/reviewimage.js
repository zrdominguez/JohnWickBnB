'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reviewImage.belongsTo(
        models.Review,
        {
          foreignKey: "reviewId"
        }
      )
    }
  }
  reviewImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'URL is required' },
        isUrl: { msg: 'URL must be a valid URL' },
      }
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'reviewImage',
  });
  return reviewImage;
};
