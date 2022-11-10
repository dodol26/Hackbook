'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static findAllPosts(searchByContent, User, Profile) {
      let option = {
        include: {
          model: User,
          include: {
            model: Profile
          }
        },
        order: [['createdAt', 'desc']]
      }
      if (searchByContent) {
        option.where = { content: { [Op.iLike]: `%${searchByContent}%` } }
      }

      return Post.findAll(option)
    }

    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
    }
    get formattedDate() {
      let date = new Date(this.createdAt)
      let month = date.toLocaleString('default', { month: 'long' })
      let day = date.getDate()
      let year = date.getFullYear()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let ampm = hour >= 12 ? 'pm' : 'am'
      hour = hour % 12
      hour = hour ? hour : 12
      minute = minute < 10 ? '0' + minute : minute
      let strTime = hour + ':' + minute + ' ' + ampm
      return `${month} ${day} ${year}, ${strTime}`
    }
  }
  Post.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Content cannot be empty'
        },
        notEmpty: {
          msg: 'Content cannot be empty'
        }
      }
    },
    imageURL: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    vote: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};