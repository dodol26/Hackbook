'use strict';
const fs=require('fs')
let user = JSON.parse(fs.readFileSync('../data/user.json', 'utf8'))
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up (queryInterface, Sequelize) {
    user.forEach(element => {
      element.createdAt = new Date()
      element.updatedAt = new Date()
    });
   return queryInterface.bulkInsert('Users', user, {});
  },

   down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
