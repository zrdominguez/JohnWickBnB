const express = require('express');
const { Spot, User, Image, Review, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { checkIfExists, checkOwnership } = require('../../utils/helper')
const { handleValidationErrors } = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();
///////////////////////////////////////////

//express-validator arrays

const validateNewReviewImage = [
  check("url")
    .exists({checkFalsy: true})
    .notEmpty()
    .isString()
    .isURL()
    .withMessage("Must be a valid URL"),
  handleValidationErrors
];

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

///////////////////////////////////////////

//Helper Functions

const checkImageLimit = (images) => {
  if(images.length > 10){
    let error = new Error("Maximum number of images for this resource was reached");
    error.status = 403
    error.title = "Cannot add any more images because there is a maximum of 10";
    return error;
  }
}

///////////////////////////////////////////

//Create a new Image for Review
router.post('/:reviewId/images',
  requireAuth,
  validateNewReviewImage,
  async (req, res, next) =>{
    const {reviewId} = req.params;

    const review = await Review.findByPk(reviewId,{
      include:{
        model: Image,
        as: "ReviewImages",
        required: false,
        attributes: ["url"]
      },
      group:["ReviewImages.id"]
    })

    const notFoundError = checkIfExists(review, 'Review');
    if(notFoundError) return next(notFoundError);

    const checkLimit = checkImageLimit(review.ReviewImages);
    if(checkLimit) return next(checkLimit);

    const {id} = req.user;

    const authError = checkOwnership(review, true, id);
    if(authError) return next(authError);

    const {url} = req.body;

    const newImage = await Image.create({
      imageableType: 'review',
      imageableId: reviewId,
      url: url,
    })

    res.json({id: newImage.id, url: newImage.url})
})

//Get reviews of current User
router.get('/current',
  requireAuth,
  async (req, res) => {
  const {id} = req.user;

  const userReviews = await Review.findAll({
    where:{userId : id},
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
          //include: [[sequelize.col("SpotImages"), "previewImage"]],
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
    group:["Review.id", "ReviewImages.id"]
  })

  const formatedReviews = await Promise.all(
    userReviews.map(async (review) => {
      const spot = review.Spot;

      if(spot.SpotImages.length > 0){
        spot.dataValues["previewImage"] = spot.SpotImages[0].url
        delete spot.dataValues.SpotImages;
      }

      return review
  }))

  res.json({Reviews: formatedReviews});
})

//Edit Review
router.put("/:reviewId",
  requireAuth,
  validateNewReview,
  async (req, res, next) => {
    const {reviewId} = req.params;

    const review = await Review.findByPk(reviewId);

    const notFoundError = checkIfExists(review, 'Review');
    if(notFoundError) return next(notFoundError);

    const {id} = req.user;

    const authError = checkOwnership(review, true, id);
    if(authError) return next(authError);

    await review.update(req.body);

    res.json(review)
  })

//Delete Review
router.delete("/:reviewId",
  requireAuth,
  async (req, res, next) => {
    const {reviewId} = req.params;

    const review = await Review.findByPk(reviewId);

    const notFoundError = checkIfExists(review, 'Review');
    if(notFoundError) return next(notFoundError);

    const {id} = req.user

    const authError = checkOwnership(review, true, id);
    if(authError) return next(authError);

    await review.destroy()

    res.json({message: "Successfully deleted"})
  })

module.exports = router;
