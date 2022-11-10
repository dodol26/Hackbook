'use strict';
const {
  Model
} = require('sequelize');
const { hashingPassword } = require('../helpers')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static findLoggedUser(id, Profile) {
      return User.findOne({
        where: { id },
        include: Profile
      })
    }

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
        isEmail: {
          args: true,
          msg: 'Please input an email'
        },
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password cannot be empty'
        },
        notEmpty: {
          msg: 'Password cannot be empty'
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    var hash = hashingPassword(user.password)
    user.password = hash
    user.role = 'user'
  })

  return User;
};