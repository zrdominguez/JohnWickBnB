'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,
        {
          foreignKey: 'ownerId'
        }
      )
      Spot.hasMany(
        models.Review,
        {
          foreignKey: 'spotId',
          onDelete: 'cascade',
          hooks: true
        }
      )
      Spot.hasMany(
        models.Booking,
        {
          foreignKey: 'spotId',
          onDelete: 'cascade',
          hooks: true
        }
      )
      Spot.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          constraints: false,
          onDelete: 'cascade',
          hooks: true,
          scope: {
            imageableType: 'spot'
          }
        }
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Street address is required' },
        notEmpty: { msg: 'Street address is required' },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'City is required' },
        notEmpty: { msg: 'City is required' },
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'State is required' },
        notEmpty: { msg: 'State is required' },
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Country is required' },
        notEmpty: { msg: 'Country is required' },
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Latitude must be within -90 and 90' },
        isDecimal: { msg: 'Latitude must be within -90 and 90' },
        max : {
          args: [90],
          msg: 'Latitude must be within -90 and 90'
        },
        min:{
          args: [-90],
          msg: 'Latitude must be within -90 and 90'
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Longitude must be within -180 and 180' },
        isDecimal: { msg: 'Longitude must be within -180 and 180' },
        max : {
          args: [180],
          msg: 'Longitude must be within -180 and 180'
        },
        min:{
          args: [-180],
          msg: 'Longitude must be within -180 and 180'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Name is required' },
        notEmpty: { msg: 'Name is required' },
        len: {
          args:[1,50],
          msg: 'Name must be less than 50 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Description is required' },
        notEmpty: { msg: 'Description is required' },
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Price is required' },
        isInt: { msg: 'Price must be an integer' },
        min: {
          args: [1],
          msg: 'Price per day must be a positive number'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
