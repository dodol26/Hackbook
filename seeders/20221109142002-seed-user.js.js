'use strict';
const fs=require('fs')
var bcrypt = require('bcryptjs')

let user = JSON.parse(fs.readFileSync('./data/user.json', 'utf8'))
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up (queryInterface, Sequelize) {
    user.forEach(element => {
      var salt = bcrypt.genSaltSync(10)
      var hash = bcrypt.hashSync(element.password, salt)
      element.password = hash
      element.createdAt = new Date()
      element.updatedAt = new Date()
    });
   return queryInterface.bulkInsert('Users', user, {});
  },

   down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
