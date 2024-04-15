'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("learning_statuses", [
      {
        name: "Đang học",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bảo lưu",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bỏ học",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Đã hoàn thành",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
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
