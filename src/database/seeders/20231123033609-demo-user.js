"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [];
    for (let index = 0; index < 30; index++) {
      const bcrypt = require("bcrypt");
      const saltRounds = 10;
      const password = "123";
      const passwordHash = bcrypt.hash(password, saltRounds);
      const hash = await passwordHash;
      if(index<10){
        data.push({
          name: `User ${index + 1}`,
          email: `user${index + 1}@gmail.com`,
          password: hash,
          typeId:1,

          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }else if(index>=10&&index<20){
        data.push({
          name: `User ${index + 1}`,
          email: `user${index + 1}@gmail.com`,
          password: hash,
          typeId:2,

          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }else{
        data.push({
          name: `User ${index + 1}`,
          email: `user${index + 1}@gmail.com`,
          password: hash,
          typeId:3,

          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
    }
    await queryInterface.bulkInsert("users", data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
