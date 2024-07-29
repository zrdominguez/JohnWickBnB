const express = require('express');
const { Spot, User, Image, Review, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, checkIfUserIsLoggedIn } = require('../../utils/validation');
const e = require('express');

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

function checkIfSpotExists(spot){
  if(!spot){
    const error = new Error("Spot couldn't be found")
    error.status = 404
    error.title = "Not Found"
    return error;
  }
}

//Add Image to Spot
router.post('/:spotId/images',
  validateNewImage,
  async (req, res, next) => {

    const ownerId = await checkIfUserIsLoggedIn(req);
    if(typeof ownerId == 'object') return next(ownerId);

    const {spotId} = req.params;
    const spot = await Spot.findOne({
      where:{
        id: spotId,
        ownerId: ownerId
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

    res.json({id: newImage.id, url, preview})
  })

  //Edit Spot
  router.put('/:spotId',
    validateSpot,
    async (req, res, next) => {
    const ownerId = await checkIfUserIsLoggedIn(req);
    if(typeof ownerId == 'object') return next(ownerId);

    const {spotId} = req.params;

    const spot = await Spot.findOne({
      where:{
        id: spotId,
        ownerId: ownerId
      },
    });

    const checkSpot = checkIfSpotExists(spot);
    if(checkSpot) return next(checkSpot);

    await spot.update(req.body);

    res.status(201)

    res.json(spot)
  })

  //Get spots of current user
router.get('/session', async (req, res, next) => {
  const ownerId = await checkIfUserIsLoggedIn(req)
  if(typeof ownerId == 'object') return next(ownerId);

  const userSpots = await Spot.findAll({
    where:{ownerId: ownerId},
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

  const checkSpot = checkIfSpotExists(spot);
  if(checkSpot) return next(checkSpot);

  res.json(spot);
})

//Delete Spot
router.delete('/:spotId', async (req, res, next) => {

  const ownerId = await checkIfUserIsLoggedIn(req);
  if(typeof ownerId == 'object') return next(ownerId);


  const {spotId} = req.params;
  const deletedSpot = await Spot.findOne({
    where:{
      id: spotId,
      ownerId: ownerId
    }
  });

  const checkSpot = checkIfSpotExists(deletedSpot);
  if(checkSpot) return next(checkSpot);

  await deletedSpot.destroy();

  res.json({message: 'Successfully deleted'})
})

//Create a spot
router.post('/',
  validateSpot,
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

    const ownerId = await checkIfUserIsLoggedIn(req);
    if(typeof ownerId == 'object') return next(ownerId);

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
    res.status(201)
    await newSpot.save()

    res.json(newSpot);
})

module.exports = router;
