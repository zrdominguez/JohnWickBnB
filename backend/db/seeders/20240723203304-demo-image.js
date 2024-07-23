'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Images', [
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://example.com/images/cozy-apartment.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 2,
        url: 'https://example.com/images/modern-condo.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'review',
        imageableId: 1,
        url: 'https://example.com/images/review-1.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'review',
        imageableId: 2,
        url: 'https://example.com/images/review-2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Images', null, {});
  }
};
