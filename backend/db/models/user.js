'use strict';
const {
  Model,
  Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(
        models.Spot,
        {
          foreignKey: 'ownerId',
        }
      )
      User.hasMany(
        models.Review,
        {
          foreignKey: 'userId',
        }
      )
      User.hasMany(
        models.Booking,
        {
          foreignKey: 'userId',
        }
      )
    }
  }
  User.init({
    firstName:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate:{
        notNull: { msg: 'First name is required' },
        notEmpty: { msg: 'First name cannot be empty' },
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.");
          }
        },
        isAlpha:true
      }
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate:{
        notNull: { msg: 'Last name is required' },
        notEmpty: { msg: 'Last name cannot be empty' },
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.");
          }
        },
        isAlpha:true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len:[4,30],
        notNull: { msg: 'Username is required' },
        notEmpty: { msg: 'Username cannot be empty' },
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        notNull: { msg: 'Email is required' },
        isEmail: { msg: 'Email must be a valid email address' }
      }
    },
    hashedPassword:
    {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60,60]
      }
    }
  },
  {
    sequelize,
    modelName: 'User',
    defaultScope:{
      attributes:{
        exclude:["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};
