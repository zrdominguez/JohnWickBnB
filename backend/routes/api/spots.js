const express = require('express');
const { Spot, User, Image, Review, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors} = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({checkFalsy: true})
    .notEmpty()
    .customSanitizer(val => val ? val.replace(/\s+/g,'') : null)
    .isAlphanumeric()
    .withMessage('Street address is required'),
  check('city')
    .exists({checkFalsy: true})
    .notEmpty()
    .customSanitizer(val=> val ? val.replace(/\s+/g,'') : null)
    .isAlpha()
    .withMessage('City is required'),
  check('state')
    .exists({checkFalsy: true})
    .notEmpty()
    .customSanitizer(val=> val ? val.replace(/\s+/g,'') : null)
    .isAlpha()
    .withMessage('State is required'),
  check('country')
    .exists({checkFalsy: true})
    .notEmpty()
    .customSanitizer(val=> val ? val.replace(/\s+/g,'') : null)
    .isAlpha()
    .withMessage('Country is required'),
  check('lat')
    .exists({checkFalsy: true})
    .notEmpty()
    .isDecimal()
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({checkFalsy: true})
    .notEmpty()
    .isDecimal()
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

const validateNewImage = [
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

function checkIfSpotExists(spot){
  if(!spot){
    const error = new Error("Spot couldn't be found")
    error.status = 404
    error.title = "Not Found"
    return error;
  }
}

//Create a Review for a Spot
router.post('/:spotId/reviews',
validateNewReview,
requireAuth,
async (req, res, next) => {

  const {spotId} = req.params
  const spot = await Spot.findByPk(spotId)

  const checkSpot = checkIfSpotExists(spot)
  if(checkSpot) return next(checkSpot)

  const existingReview = await Review.findOne({
    where:{
      spotId: parseInt(spotId),
      userId: spot.ownerId,
    }
  })

  if(existingReview){
    const error = new Error("User already has a review for this spot");
    error.status = 403;
    error.title = "Forbidden"
    return next(error)
  }

  const {review, stars} = req.body;

  const newReview = await Review.build({
    spotId: parseInt(spotId),
    userId: spot.ownerId,
    review: review,
    stars: stars
  })

  await newReview.validate();
  await newReview.save()

  res.json(newReview)
})

//Get all Reviews by spotId
router.get('/:spotId/reviews', async (req, res, next) => {
  const {spotId} = req.params
  const spot = await Spot.findByPk(spotId)

  const checkSpot = checkIfSpotExists(spot)
  if(checkSpot) return next(checkSpot)

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
    group:["Review.id", "ReviewImages.id"]
    })

    res.json({Reviews})
})

//Add Image to Spot
router.post('/:spotId/images',
  validateNewImage,
  requireAuth,
  async (req, res, next) => {

    const {id} = req.user

    const {spotId} = req.params;
    const spot = await Spot.findOne({
      where:{
        id: spotId,
        ownerId: id
      }
    });

    const checkSpot = checkIfSpotExists(spot);
    if(checkSpot) return next(checkSpot)

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
  validateSpot,
  requireAuth,
  async (req, res, next) => {
    const {id} = req.user
    const {spotId} = req.params;

    const spot = await Spot.findOne({
      where:{
        id: spotId,
        ownerId: id
      },
    });

    const checkSpot = checkIfSpotExists(spot);
    if(checkSpot) return next(checkSpot);

    await spot.update(req.body);

    res.status(201)

    res.json(spot)
})


//Get spots of current user
router.get('/session',
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
    group:["Spot.id"]
  })

  res.json({Spots: userSpots})
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
    group: ['Spot.id', 'SpotImages.id']
  });

  const checkSpot = checkIfSpotExists(spot);
  if(checkSpot) return next(checkSpot);

  res.json(spot);
})

//Delete Spot
router.delete('/:spotId',
  requireAuth,
  async (req, res, next) => {
  const {id} = req.user

  const {spotId} = req.params;
  const deletedSpot = await Spot.findOne({
    where:{
      id: spotId,
      ownerId: id
    }
  });

  const checkSpot = checkIfSpotExists(deletedSpot);
  if(checkSpot) return next(checkSpot);

  await deletedSpot.destroy();

  res.json({message: 'Successfully deleted'})
})

//Get all spots
router.get('/', async (req, res)=>{

  const Spots = await Spot.findAll({
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
    group:["Spot.id"]
  });

  res.json({Spots});
})

//Create a spot
router.post('/',
  validateSpot,
  requireAuth,
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
