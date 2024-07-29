const express = require('express');
const { Spot, User, Image, Review, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, checkIfUserIsLoggedIn } = require('../../utils/validation');
const e = require('express');
const { where } = require('sequelize');
const review = require('../../db/models/review');

const router = express.Router();

router.get('/session', async (req, res, next) => {
  const userId = checkIfUserIsLoggedIn(req);
  if(typeof userId == 'object') return next(userId);

  const userReviews = await Review.findAll({
    where:{userId : userId},
    include:[
      {
        model: User,
        attributes:["id", "firstName", "lastName"],
        required: true
      },
      {
        model: Spot,
        include:[
          {
            model: Image,
            as: "SpotImages",
            attributes:["url"],
            required: false,
            where:{preview: true},
          }
        ],
        required: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        },
      },
      {
        model: Image,
        as: "ReviewImages",
        attributes:["id", "url"],
        required: false,
      }
    ],
    group:["Review.id"]
  })

  const Reviews = await Promise.all(
    userReviews.map(async (review) => {
      const spot = review.Spot;
      if(spot.SpotImages.length > 0){
        spot.dataValues["previewImage"] = spot.SpotImages[0].url
        delete spot.dataValues.SpotImages;
      }
      return review
  }))

  res.json({Reviews});
})
module.exports = router;
