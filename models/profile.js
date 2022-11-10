'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    genderTitle(){
      if(this.gender === "Male"){
        return `Mr. ${this.name}`
      }else if(this.gender === "Female"){
        return `Mrs. ${this.name}`
      }
    }

    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
      
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name cannot be empty'
        },
        notEmpty: {
          msg: 'Name cannot be empty'
        }
      }
    },
    dateOfBirth: DataTypes.DATE,
    profilePicture: DataTypes.STRING,
    aboutMe: DataTypes.TEXT,
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    gender: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};