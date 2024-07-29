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
    await queryInterface.bulkInsert('spotImages', [
      {
        url: 'https://example.com/image1.jpg',
        preview: true,
        spotId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://example.com/image2.jpg',
        preview: false,
        spotId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://example.com/image3.jpg',
        preview: true,
        spotId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://example.com/image4.jpg',
        preview: false,
        spotId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('spotImages', null, {});
  }
};
