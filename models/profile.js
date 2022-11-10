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
    newUser(UserId) {
      let name = `user${new Date().getTime()}`
      let dateOfBirth = new Date()
      let profilePicture = 'https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png'
      let aboutMe = "Im a Dragon!!"
      let gender = undefined
      return { name, dateOfBirth, profilePicture, aboutMe, gender, UserId }
    }

    static newProfile(UserId) {
      let data = new Profile().newUser(UserId)
      return Profile.create(data)
    }

    get dateFormat() {
      let dd = this.dateOfBirth.getDate().toString().padStart(2, '0')
      let mm = (this.dateOfBirth.getMonth() + 1).toString().padStart(2, '0')
      let yyyy = this.dateOfBirth.getFullYear()
      return `${yyyy}-${mm}-${dd}`
    }

    get genderTitle() {
      if (this.gender === "Male") {
        return `Mr. ${this.name}`
      } else if (this.gender === "Female") {
        return `Mrs. ${this.name}`
      } else {
        return `${this.name}`
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