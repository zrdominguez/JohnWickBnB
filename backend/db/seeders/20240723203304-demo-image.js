'use strict';

const { Image } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
    await Image.bulkCreate([
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://plus.unsplash.com/premium_photo-1685133855289-c03dbdf78fee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Preview image
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://images.pexels.com/photos/27543244/pexels-photo-27543244/free-photo-of-a-bedroom-with-a-large-window-and-a-bed.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Amenity: Sleek living room
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://images.unsplash.com/photo-1533423996375-f914ab160932?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Amenity: High-end kitchen
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://images.unsplash.com/photo-1567002260451-50e05a6b031a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Amenity: Luxurious bathroom
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://images.pexels.com/photos/4906520/pexels-photo-4906520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Amenity: Dark, cozy bedroom
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 2,
        url: 'https://plus.unsplash.com/premium_photo-1694475731860-1fe1cb7a1897?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Preview image
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 3,
        url: 'https://www.refinery29.com/images/11529234.jpg?format=webp&width=1090&height=1308&quality=85&crop=5%3A6', // Preview image
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //{
      //   imageableType: 'review',
      //   imageableId: 1,
      //   url: 'https://example.com/images/review-1.jpg',
      //   preview: false,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   imageableType: 'review',
      //   imageableId: 1,
      //   url: 'https://example.com/images/cool-review-1.jpg',
      //   preview: false,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   imageableType: 'review',
      //   imageableId: 2,
      //   url: 'https://example.com/images/review-2.jpg',
      //   preview: false,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   imageableType: 'review',
      //   imageableId: 3,
      //   url: 'https://example.com/images/ok-review-1.jpg',
      //   preview: false,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Images'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      imageableId: {[Op.lt]: 4}
    }, {});
  }
};
