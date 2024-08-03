const { check } = require('express-validator');
const {Review, Booking, Spot}= require('../db/models');

//finds out if date1 is the same as date2
// const isDateTheSame = (date1, date2) => {
//   if(date1 > date2 || date1 < date2) return false
//   return true
// }

//Finds conflicts in booking dates
async function checkBookingConflict(testBooking){
  const allBookings = await Booking.findAll({
    where:{spotId: testBooking.spotId},
    attributes:["startDate", "endDate"]
  })

  const testStartDate = testBooking.startDate;
  const testEndDate = testBooking.endDate;
  const today = new Date();

  if(testStartDate < today){
    const error = new Error("Past bookings can't be modified");
    error.status = 403;
    error.title = "Can't edit a booking that's past the end date"
    return error;
  }

  let errorList = {}

  for await (const booking of allBookings) {
    const {startDate, endDate} = booking
    console.log(isDateTheSame(testStartDate, startDate))
    if(testStartDate <= endDate &&
      testStartDate >= startDate ||
      testStartDate < startDate &&
      testEndDate > startDate){
      errorList["startDate"] = "Start date conflicts with an existing booking"
    }
    if(testEndDate >= startDate &&
      testEndDate <= endDate ||
      testEndDate > endDate &&
      testStartDate < endDate){
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

function checkIfExists(instance, modelName){
  if(!instance){
    const error = new Error(`${modelName} couldn't be found`);
    error.title = `Couldn't find a ${modelName} with the specified id`;
    error.status = 404
    return error
  }
}

function checkOwnership (instance, ownership, userId){
  const modelName = instance.constructor.name;
  let property = modelName === 'Spot' ? "ownerId" : "userId";

  const error = new Error("Forbidden");
  error.title = "Require proper authorization";
  error.status = 403
  if(ownership){
    return instance[property] == userId ? null : error;
  }else{
    return instance[property] != userId ? null : error;
  }
}

module.exports = {checkBookingConflict, checkIfExists, checkOwnership}
