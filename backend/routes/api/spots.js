const express = require('express');
const { Op } = require('sequelize');
const {checkBookingConflict, checkIfExists, checkOwnership} = require('../../utils/helper');
const { Spot, User, Image, Review, Booking, sequelize } = require('../../db/models');
const { check, query } = require('express-validator');
const { handleValidationErrors} = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();

/////////////////////////////////////////////////////////

//express-validator arrays

const validateSpot = [
  check("address")
    .exists({checkFalsy: true})
    .notEmpty()
    .isAlphanumeric('en-US', {ignore: '\s'})
    .withMessage('Street address is required'),
  check('city')
    .exists({checkFalsy: true})
    .notEmpty()
    .isAlpha('en-US', {ignore: '\s'})
    .withMessage('City is required'),
  check('state')
    .exists({checkFalsy: true})
    .notEmpty()
    .isAlpha('en-US', {ignore: '\s'})
    .withMessage('State is required'),
  check('country')
    .exists({checkFalsy: true})
    .notEmpty()
    .isAlpha('en-US', {ignore: '\s'})
    .withMessage('Country is required'),
  check('lat')
    .exists({checkFalsy: true})
    .notEmpty()
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({checkFalsy: true})
    .notEmpty()
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({checkFalsy: true})
    .notEmpty()
    .isLength({min: 1, max: 50})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists({checkFalsy: true})
    .notEmpty()
    .isInt({min: 1})
    .withMessage('Price per day must be a positive number'),
    handleValidationErrors
]

const validateNewSpotImage = [
  check("url")
    .exists({checkFalsy: true})
    .notEmpty()
    .isString()
    .isURL()
    .withMessage("Must be a valid URL"),
  check("preview")
    .exists()
    .notEmpty()
    .isBoolean()
    .withMessage("value must be true or false"),
    handleValidationErrors
]

const validateNewReview =[
  check('review')
    .exists({checkFalsy: true})
    .notEmpty()
    .isString()
    .withMessage("Review text is required"),
  check('stars')
    .exists({checkFalsy: true})
    .notEmpty()
    .isInt({min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

const validateNewBooking = [
  check('startDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isString().withMessage("isString")
    .custom(value =>{
      const today = new Date()
      return new Date(value) <= today ? false : value
    }).withMessage("startDate cannot be in the past")
    .isDate().withMessage("isDate")
    .withMessage("startDate cannot be in the past"),
  check('endDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isString()
    .custom((value, {req}) =>{
      return new Date(value) <= new Date(req.body.startDate) ? false : value
    }).withMessage("endDate cannot be on or before startDate")
    .isDate()
    .withMessage("endDate cannot be on or before startDate"),
  handleValidationErrors
]

const validateQuery = [
  query('page')
    .default(1)
    .isInt({min: 1}).withMessage(
      "Page must be greater than or equal to 1"
    ),
  query('size')
    .default(20)
    .isInt({min: 1, max: 20}).withMessage(
      "Size must be between 1 and 20"
    ),
  query('maxLat')
    .optional()
    .isDecimal()
    .isFloat({max: 90})
    .withMessage(
      "Maximum latitude is invalid"
    )
    .custom((value, {req}) => {
      if(value >= req.query.minLat) return value
      else throw new Error("Maximum Latitude cannot be less than Minimum Latitude")
    }),
  query('minLat')
    .optional()
    .isDecimal()
    .isFloat({min: -90})
    .withMessage(
      "Minimum latitude is invalid"
    )
    .custom((value, {req}) => {
      if(value <= req.query.maxLat) return value
      else throw new Error("Minimum Latitude cannot be more than Maximum Latitude")
    }),
  query('maxLng')
    .optional()
    .isDecimal()
    .isFloat({max: 180})
    .withMessage(
      "Maximum longitude is invalid"
    )
    .custom((value, {req}) => {
      if(value >= req.query.minLng) return value
      else throw new Error("Maximum Longitude cannot be less than Minimum Longitude")
    }),
  query('minLng')
    .optional()
    .isDecimal()
    .isFloat({min: -180})
    .withMessage(
      "Minimum longitude is invalid"
    )
    .custom((value, {req}) => {
      if(value <= req.query.maxLng) return value
      else throw new Error("Minimum Longitude cannot be more than Maximum Longitude")
    }),
  query('minPrice')
    .optional()
    .isFloat({min:0})
    .withMessage(
      "Minimum price must be greater than or equal to 0"
    )
    .custom((value, {req}) => {
      if(value <= req.query.maxPrice) return value
      else throw new Error("Minimum price cannot be more than Maximum price")
    }),
  query('maxPrice')
    .optional()
    .isFloat({min:0})
    .withMessage(
      "Maximum price must be greater than or equal to 0"
    )
    .custom((value, {req}) => {
      if(value >= req.query.minPrice) return value
      else throw new Error("Maximum price cannot be less than Minimum price")
    }),
  handleValidationErrors
]

/////////////////////////////////////////////////////////

//Create a Review for a Spot
router.post('/:spotId/reviews',
requireAuth,
validateNewReview,
async (req, res, next) => {

  const {spotId} = req.params
  const spot = await Spot.findByPk(spotId)

  const notFoundError = checkIfExists(spot, 'Spot')
  if(notFoundError) return next(notFoundError)

  const {id} = req.user

  const existingReview = await Review.findOne({
    where:{
      spotId: parseInt(spotId),
      userId: parseInt(id),
    }
  })

  if(existingReview) {
    const error = new Error("User already has a review for this spot");
    error.title = "Review from the current user already exists for the Spot";
    return next(error);
  }

  const {review, stars} = req.body;

  const newReview = await Review.build({
    spotId: parseInt(spotId),
    userId: parseInt(id),
    review: review,
    stars: stars
  })

  await newReview.validate();
  await newReview.save()

  res.json(newReview)
})

//Get all bookings of spot
router.get('/:spotId/bookings',
  requireAuth,
  async (req, res, next) => {
  const {spotId} = req.params
  const {id} = req.user
  let options;

  const spot = await Spot.findByPk(spotId)

  const notFoundError = checkIfExists(spot, 'Spot')
  if(notFoundError) return next(notFoundError)

  if(spot.ownerId === parseInt(id)){
    options = {
      include:{
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      group: ["Booking.id, User.id"]
    }
  }else{
    options = {
      attributes:['spotId', 'startDate', 'endDate'],
      group: ["Booking.id"]
    }
  }

  const spotBookings = await Booking.findAll(options);

  res.json(spotBookings)
})

//Get all Reviews by spotId
router.get('/:spotId/reviews', async (req, res, next) => {
  const {spotId} = req.params
  const spot = await Spot.findByPk(spotId)

  const notFoundError = checkIfExists(spot, 'Spot')
  if(notFoundError) return next(notFoundError)

  const Reviews = await Review.findAll({
    where: {spotId: spotId},
    include:[
      {
        model: User,
        attributes:['id', 'firstName', 'lastName'],
        required: true
      },
      {
        model: Image,
        as: "ReviewImages",
        attributes: ['id', 'url'],
        required: false,
      }
    ],
    group:["Review.id", "User.id", "ReviewImages.id"]
    })

    res.json({Reviews})
})

//Add a Booking to Spot
router.post('/:spotId/bookings',
  requireAuth,
  validateNewBooking,
  async (req, res, next) =>{
    const {spotId} = req.params;
    const spot = await Spot.findByPk(spotId)

    let notFoundError = checkIfExists(spot, 'Spot')
    if(notFoundError) return next(notFoundError)

    const {id} = req.user

    const authError = checkOwnership(spot, false, id);
    if(authError) return next(authError);

    const {startDate, endDate} = req.body

    const newBooking = await Booking.build({
      spotId: parseInt(spotId),
      userId: id,
      startDate: startDate,
      endDate: endDate
    })

    const dateError = await checkBookingConflict(newBooking)
    if(dateError) return next(dateError)

    await newBooking.validate()
    await newBooking.save();

    res.json(newBooking)
})

//Add Image to Spot
router.post('/:spotId/images',
  requireAuth,
  validateNewSpotImage,
  async (req, res, next) => {
    const {spotId} = req.params;
    const spot = await Spot.findByPk(spotId);

    const notFoundError = checkIfExists(spot, 'Spot');
    if(notFoundError) return next(notFoundError);

    const {id} = req.user

    const authError = checkOwnership(spot, true, id);
    if(authError) return next(authError);

    const {url, preview} = req.body

    const newImage = await Image.build({
      imageableType: 'spot',
      imageableId: spotId,
      url: url,
      preview: preview
    })

    await newImage.validate();
    res.status(201)
    await newImage.save()

    res.json({id: newImage.id, url, preview});
})

//Edit Spot
router.put('/:spotId',
  requireAuth,
  validateSpot,
  async (req, res, next) => {
    const {spotId} = req.params;

    const spot = await Spot.findByPk(spotId)

    const notFoundError = checkIfExists(spot, 'Spot');
    if(notFoundError) return next(notFoundError);

    const {id} = req.user

    const authError = checkOwnership(spot, true, id);
    if(authError) return next(authError);

    await spot.update(req.body);

    res.status(201)

    res.json(spot)
})

//Get spots of current user
router.get('/current',
  requireAuth,
  async (req, res) => {
  const {id} = req.user

  const userSpots = await Spot.findAll({
    where:{ownerId: id},
    include:[{
      model: Image,
      attributes: [],
      as: "SpotImages",
      required: false,
      where:{preview: true}
    },
    {
      model: Review,
      attributes: [],
      required: false
    }],
    attributes:{
      include:[
        [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.col("SpotImages.url"), "previewImage"]
      ]
    },
    group:["Spot.id", "SpotImages.url"]
  })

  const spotsWithAvgRating = userSpots.map(spot => {
    const avgRating = parseFloat(spot.get('avgRating')) || 0;
    return {
      ...spot.toJSON(),
      avgRating
    };
  });

  res.json({Spots: spotsWithAvgRating})
})

//Get Spot by spotId
router.get('/:spotId', async (req, res, next) => {
  const {spotId} = req.params;
  const spot = await Spot.findByPk(spotId, {
    include:[{
      model: Image,
      attributes: ["id", "url", "preview"],
      as: "SpotImages",
      required: false,
    },
    {
      model: Review,
      attributes: [],
      required: false
    },
    {
      model: User,
      attributes:["id", "firstName", "lastName"],
      as: "Owner",
      required: true
    }
  ],
    attributes:{
      include:[
        [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgStarRating"],
        [sequelize.fn('COUNT', sequelize.col("Reviews.id")), "numReviews"],
      ]
    },
    group: ['Spot.id', 'SpotImages.id', 'Owner.id']
  });

  const checkSpot = checkIfExists(spot, 'Spot');
  if(checkSpot) return next(checkSpot);

  const avgRating = parseFloat(spot.get('avgRating')) || 0;

  res.json({
    ...spot.toJSON(),
    avgRating
  });
})

//Delete Spot
router.delete('/:spotId',
  requireAuth,
  async (req, res, next) => {
  const {spotId} = req.params;

  const deletedSpot = await Spot.findByPk(spotId);

  const notFoundError = checkIfExists(deletedSpot, 'Spot');
  if(notFoundError) return next(notFoundError);

  const {id} = req.user

  const authError = checkOwnership(deletedSpot, true, id);
  if(authError) return next(authError);


  await deletedSpot.destroy();

  res.json({message: 'Successfully deleted'})
})

//Get all spots
router.get('/',
  validateQuery,
  async (req, res)=>{

  const {
    page,
    size,
    maxLat,
    minLat,
    maxLng,
    minLng,
    minPrice,
    maxPrice,
  } = req.query

  const mostExpensive = await Spot.max('price');
  const offset = size * (page - 1);
  const limit = size;

  const options = {
    where:{
      lat: {[Op.and]: [
        {[Op.gte]: minLat || -90},
        {[Op.lte]: maxLat || 90},
      ]},
      lng: {[Op.and]: [
        {[Op.gte]: minLng || -180},
        {[Op.lte]: maxLng || 180}
      ]},
      price: {[Op.and]: [
        {[Op.gte]: minPrice || 0},
        {[Op.lte]: maxPrice || mostExpensive}
      ]}
    },
    include:[{
      model: Image,
      as: "SpotImages",
      attributes: [],
      required: false,
      where:{preview: true},
    },
    {
      model: Review,
      attributes: [],
      required: false
    }],
    attributes:{
      include:[
        [sequelize.fn('AVG', sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.col("SpotImages.url"), "previewImage"]
      ]
    },
    group:["Spot.id","SpotImages.id"],
    offset: offset,
    limit: limit,
    subQuery: false
  }

  const spots = await Spot.findAll(options)


  const spotsWithAvgRating = spots.map(spot => {
    const avgRating = parseFloat(spot.get('avgRating')) || 0;
    return {
      ...spot.toJSON(),
      avgRating
    };
  });

  res.json({Spots: spotsWithAvgRating});
})

//Create a spot
router.post('/',
  requireAuth,
  validateSpot,
  async (req, res) => {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    } = req.body

    const {id} = req.user

    const newSpot = await Spot.build({
      ownerId: id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })

    await newSpot.validate()
    res.status(201)
    await newSpot.save()

    res.json(newSpot);
})

module.exports = router;
