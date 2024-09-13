'use strict';

const { Review } = require('../models');

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
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        review: 'Staying here reminded me of the quiet before a storm—a sanctuary amidst chaos. The rooms are immaculate, like the Continental, with every detail attended to as if Winston himself were watching. I found solace in the tranquility, but also a readiness for whatever might come. It was more than just a place to rest; it was a stronghold, a reminder that sometimes, even the most relentless warriors need a moment of peace. Five stars, because even John Wick deserves a night off.',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        spotId: 1,
        review: 'The moment I walked in, it felt like a place where deals are made, and lines are drawn. The decor whispered of elegance and danger—a perfect balance. It’s the kind of place where you’d expect to see a tailor quietly working in the corner or a sommelier preparing a glass of the finest wine. I half-expected to hear the faint sounds of classical music echoing through the halls, a calming backdrop to the inevitable chaos outside. A place fitting for those who live by their own set of rules. Five stars, because it’s not just a stay; it’s a statement.',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        spotId: 1,
        review: 'I came here seeking solace, but what I found was a reminder of the streets of New York, where every corner hides a secret and every shadow tells a story. It’s not the Continental, but it has its own charm—a raw, unpolished edge that speaks to those of us who know that peace is a fleeting luxury. The bed was firm, like the resolve needed to face old enemies, and the view… well, it was a stark reminder that sometimes, you have to keep moving. Three stars, because it’s not perfect, but then again, neither am I.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
      //   userId: 2,
      //   spotId: 2,
      //   review: 'This place felt like the kind of spot where you come to regroup, to rethink, and maybe even to make amends. The walls seemed to echo with the unspoken rules of an unspoken world—no business on the premises, but everyone knows that’s just a suggestion. It’s not the plush luxury of the Continental, but it has a certain appeal for those who live between the lines of the law. It’s rough around the edges, much like the man himself. Four stars, because it’s not about the frills; it’s about the fight.',
      //   stars: 4,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {[Op.lt]: 4}
    }, {});
  }
};
