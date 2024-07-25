const express = require('express');
const { Spot, User, Image, Review, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');

const router = express.Router();

const validateNewSpot = [
  check("address")
    .customSanitizer(val=> val.replace(/\s+/g,''))
    .exists({checkFalsy: true})
    .notEmpty()
    .isAlphanumeric()
    .withMessage('Street address is required'),
  check('city')
  .customSanitizer(val=> val.replace(/\s+/g,''))
    .exists({checkFalsy: true})
    .notEmpty()
    .isAlpha()
    .withMessage('City is required'),
  check('state')
    .customSanitizer(val=> val.replace(/\s+/g,''))
    .exists({checkFalsy: true})
    .notEmpty()
    .isAlpha()
    .withMessage('State is required'),
  check('country')
    .customSanitizer(val=> val.replace(/\s+/g,''))
    .exists({checkFalsy: true})
    .notEmpty()
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


//Get all spots
router.get('/', async (req, res)=>{

  const allSpots = await Spot.findAll({
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

  res.json(allSpots);
})

//Create a spot
router.post('/',
  validateNewSpot,
  async (req, res, next) => {
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
    let ownerId;

    const { user } = req;
    if (user) ownerId = user.id;
    else{
      const error = new Error('Please Login to a valid User');
      error.status = 401;
      error.title = 'Unauthorized';
      return next(error)
    }

    const newSpot = await Spot.build({
      ownerId,
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

    await newSpot.save()

    res.json(newSpot);
})

//Get spots of current user
router.get('/session', async (req, res, next) => {
  const {user} = req;
  if(!user){
    const error = new Error('Please Login to a valid User');
    error.status = 401;
    error.title = 'Unauthorized';
    return next(error);
  }

  const userSpots = await Spot.findAll({
    where:{ownerId: user.id},
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

  res.json(userSpots)
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
      where:{preview: true}
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
    group: ['Spot.id']
  });


  if(!spot){
    console.log(spot)
    const error = new Error("Spot couldn't be found")
    error.status = 404
    error.title = "Not Found"
    return next(error);
  }

  res.json(spot);
})



module.exports = router;
