const express = require('express');
const { Spot, Image, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { checkBookingConflict, checkOwnership, checkIfExists } = require('../../utils/helper');
const { handleValidationErrors } = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();
///////////////////////////////////////////

//express-validator arrays

const validateBooking = [
  check('startDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isString().withMessage("isString")
    .custom(value =>{
      const today = new Date()
      return new Date(value) <= today ? false : true
    }).withMessage("startDate cannot be in the past")
    .isDate().withMessage("isDate")
    .withMessage("startDate cannot be in the past"),
  check('endDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isString()
    .custom((value, {req}) =>{
      return new Date(value) <= new Date(req.body.startDate) ? false : true
    }).withMessage("endDate cannot be on or before startDate")
    .isDate()
    .withMessage("endDate cannot be on or before startDate"),
  handleValidationErrors
]

///////////////////////////////////////////

//Helper Functions

const cantDelete = (booking)=>{
  const {startDate} = booking;
  const today = new Date();
  if(startDate <= today){
    const error = new Error("Bookings that have been started can't be deleted");
    error.title = "Bookings that have been started can't be deleted";
    error.status = 403
    return error
  }
}

///////////////////////////////////////////

//Edit a Booking
router.put('/:bookingId',
  requireAuth,
  validateBooking,
  async (req, res, next) =>{
    const {bookingId} = req.params
    const booking = await Booking.findByPk(bookingId);

    const notFoundError = checkIfExists(booking, "Booking")
    if(notFoundError) return next(notFoundError)

    const {id} = req.user

    const authError = checkOwnership(booking, true, id);
    if(authError) return next(authError)

    const {startDate, endDate} = req.body;

    const dateError = await checkBookingConflict({
      spotId: booking.spotId,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    })
    if(dateError) return next(dateError);

    await booking.update(req.body);

    res.json(booking);
})

//Delete a Bookings
router.delete('/:bookingId',
  requireAuth,
  async (req, res, next) => {
    const {bookingId} = req.params;

    const deletedBooking = await Booking.findByPk(bookingId);

    const notFoundError = checkIfExists(deletedBooking, 'Booking');
    if(notFoundError) return next(notFoundError);

    const {id} = req.user;

    const authError = checkOwnership(deletedBooking, true, id);
    if(authError) return next(authError);

    const dateError = cantDelete(deletedBooking);
    if(dateError) return next(dateError);

    await deletedBooking.destroy()

    res.json({message: "Successfully deleted"});
})

//Get all Bookings of the Current User
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
      group: ["Booking.id", "Spot.id", "Spot.SpotImages.id"]
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
