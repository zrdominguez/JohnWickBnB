const express = require('express');
const { Spot, Image, Booking, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();

const validateBooking = [
  check('startDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isString()
    .custom(value =>{
      const today = new Date()
      return new Date(value) <= today ? false : true
    })
    .isDate()
    .withMessage("startDate cannot be in the past"),
  check('endDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isString()
    .custom((value, {req}) =>{
      return new Date(value) >= req.body.endDate ? false : true
    })
    .isDate()
    .withMessage("endDate cannot be on or before startDate"),
  handleValidationErrors
]

const doesBookingExist = (booking) => {
  if(!booking){
    const error = new Error("Booking couldn't be found");
    error.status = 404;
    error.title =  "Couldn't find a Booking with the specified id";
    return error;
  }
}

const isDateTheSame = (date1, date2) => {
  if(date1 > date2 || date1 < date2) return false
  return true
}

async function checkBookingConflict(testBooking){
  const allBookings = await Booking.findAll({
    where:{spotId: testBooking.spotId},
    attributes:["startDate", "endDate"]
  })

  const testStartDate = testBooking.startDate;
  const testEndDate = testBooking.endDate;

  let errorList = {}

  for await (const booking of allBookings) {
    const {startDate, endDate} = booking
    console.log(isDateTheSame(testStartDate, startDate))
    if(testStartDate < endDate &&
      testStartDate > startDate ||
      isDateTheSame(testStartDate, startDate)){
      errorList["startDate"] = "Start date conflicts with an existing booking"
    }
    if(testEndDate > startDate && testEndDate <= endDate){
      errorList["endDate"] = "End date conflicts with an existing booking"
    }
  }

  if(Object.keys(errorList).length > 0){
    const error = new Error("Sorry, this spot is already booked for the specified dates")
    error.status = 403
    error.title = "Booking conflict"
    error.errors = errorList
    return error;
  }
}

//Edit a Booking
router.put('/:bookingId',
  validateBooking,
  requireAuth,
  async (req, res, next) =>{
    const {bookingId} = req.params
    const booking = await Booking.findByPk(bookingId);

    const notFoundError = doesBookingExist(booking)
    if(notFoundError) return next(notFoundError)

    const {id} = req.user
    const isntOwnerError = doesBookingExist(
      booking.userId !== parseInt(id) ? null : true
    );

    if(isntOwnerError) return next(isntOwnerError)

    const {startDate, endDate} = req.body;

    const conflictDateError = await checkBookingConflict({
      spotId: booking.spotId,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    })
    if(conflictDateError) return next(conflictDateError);

    await booking.update(req.body);

    res.json(booking);
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
