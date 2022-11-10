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
    static findAllPosts(searchByUser, searchByContent, User, Profile){
      let option = {include: {
        model: User,
        include: {
          model: Profile
        }
      }}
      if(searchByUser){
        option.include.include = {
          where: {
            name: {
              [Op.iLike]: searchByUser
            }
          }
        }
      }
      if(searchByContent){
        option.where = {
          content: {
            [Op.iLike]: searchByContent
          }
        }
      }
      
      return Post.findAll(option)
    }

    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
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