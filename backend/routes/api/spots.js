const express = require('express');
const { Spot, User, Image, Review, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const e = require('express');

const router = express.Router();

//Get all spots
router.get('/', async (req, res)=>{

  const allSpots = await Spot.findAll({
    include:[{
      model: Image,
      attributes: [],
      where:{preview: true}
    },
    {
      model: Review,
      attributes: [],
    }],
    attributes:{
      include:[
        [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.col("Images.url"), "previewImage"]
      ]
    },
    group:["Spot.id"]
  });

  res.json(allSpots);
})

module.exports = router;
