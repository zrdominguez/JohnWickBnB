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
        url: 'https://images.pexels.com/photos/872597/pexels-photo-872597.jpeg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://images.pexels.com/photos/18123903/pexels-photo-18123903/free-photo-of-interior-of-old-rustic-bedroom-in-wooden-house.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://images.pexels.com/photos/5490204/pexels-photo-5490204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://i.pinimg.com/564x/77/70/27/777027653eb7f0006f15e4eaed67d5ad.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 1,
        url: 'https://i.pinimg.com/564x/ab/bd/1a/abbd1a8ac7a3c5638387f0adad3c0a14.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 2,
        url: 'https://i.pinimg.com/originals/68/57/a0/6857a04eaa822cfea23e01d08d7e46d8.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 2,
        url: 'https://i.pinimg.com/736x/16/9d/14/169d1443e6344385824ac65a8713afd1.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 2,
        url: 'https://i.pinimg.com/736x/1c/bd/56/1cbd56c1effa437ee4973186aab14d88.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 2,
        url: 'https://i.pinimg.com/564x/25/02/c2/2502c2f906a593ca27c8e8babfcdab1c.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableType: 'spot',
        imageableId: 3,
        url: 'https://i.pinimg.com/564x/fe/18/f5/fe18f54d361b1c58ccc45055679fdbe6.jpg',
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
