'use strict';
const {
  Model
} = require('sequelize');
var bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Post)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: {
          msg: 'Email cannot be empty'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      },
      unique: {
        args: true,
        msg: 'Email address already in use'
      }
    },
    password: DataTypes.STRING,
    role: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
    user.role = false
  })

  return User;
};