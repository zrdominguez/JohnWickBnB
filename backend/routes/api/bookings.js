const express = require('express');
const { Spot, User, Image, Review, Booking, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();

//Get all bookings of the current User
router.get('/current',
  requireAuth,
  async (req, res) => {
    const {user} = req;

    const userBookings = await Booking.findAll({
      where: {
        userId: user.id
      },
      include: {
        model: Spot,
        include: {
          model: Image,
          as: "SpotImages",
          where:{preview : true},
          attributes: ["url"],
          required: false
        },
        attributes:{
          exclude:["createdAt", "updatedAt"]
        },
        required: true
      },
      group: ["Booking.id", "Spot.id"]
    })

    userBookings.forEach(async (booking) => {
      const spot = booking.Spot;
      if(spot.SpotImages.length > 0){
        spot.dataValues["previewImage"] = spot.SpotImages[0].url
        delete spot.dataValues.SpotImages;
      }
    })

    res.json({Bookings: userBookings})
  })

module.exports = router;
