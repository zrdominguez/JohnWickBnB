'use strict';

const { Spot } = require('../models');

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
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Larue County',
        state: 'Kentucky',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: `Abraham Lincoln's Cabin`,
        description: `Stay at Lincoln's Historic Log Cabin - A Journey Through Time!\n\n
        Step back in time and experience life as Abraham Lincoln did in this rustic and charming log cabin. Nestled in the heart of the countryside, this cozy one-room cabin offers a unique glimpse into 19th-century living with all the basic comforts you need for a tranquil escape.`,
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: '456 Oak St',
        city: 'Toronto',
        state: 'Ontario',
        country: 'Canada',
        lat: 34.0522,
        lng: -118.2437,
        name: 'The Embassy',
        description: `Stay at Drake's Lavish Mansion - Where Luxury Meets Iconic Style\n\n
        Welcome to Drake's ultra-luxurious mansion, a stunning fusion of modern design and timeless elegance. Nestled in one of Toronto's most exclusive neighborhoods, this palatial home offers over-the-top amenities and world-class views. Boasting multiple bedrooms, a grand indoor pool, a state-of-the-art recording studio, and sprawling outdoor spaces, this mansion is perfect for those looking to live like a superstar. Whether you're lounging by the marble-lined pool, shooting hoops on the full-size basketball court, or dining in the opulent great room, every inch of this home exudes sophistication and celebrity glamour. This is more than just a stay—it's an unforgettable experience.`,
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 3,
        address: '987 Sub Main St',
        city: 'Route 14',
        state: 'New York',
        country: 'Unova',
        lat: 35.0943,
        lng: -110.7315,
        name: 'Pokemon Center',
        description: `Stay at the Iconic Pokémon Center - A Trainer's Dream Come True\n\n
        Welcome to the world-famous Pokémon Center, your home away from home as you embark on your Pokémon journey! Centrally located in every major region, this bright and spacious facility offers everything a trainer could need. Enjoy comfortable beds, access to the latest healing technology for your Pokémon, and a friendly staff that's always ready to assist. Whether you're resting after a long day of battling or preparing for your next adventure, the Pokémon Center provides the perfect blend of comfort and convenience. With a PC for managing your Pokémon, free Wi-Fi, and plenty of space to relax, you and your team will be refreshed and ready to take on the next challenge!`,
        price: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: {[Op.lt]: 3}
    }, {});
  }
};
