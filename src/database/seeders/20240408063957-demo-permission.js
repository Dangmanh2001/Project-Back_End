'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [];
    for (let index = 0; index < 16; index++) {
      data.push({
        value:`permission${index+1}`,
        createdAt:new Date(),
        updatedAt:new Date()
      })
    }
    await queryInterface.bulkInsert("permissions", data, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
