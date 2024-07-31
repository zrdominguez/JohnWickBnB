const express = require('express');
const { Spot, User, Image, Review, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();

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

const checkIfReviewExists = (review) =>{
  if(!review){
    const error = new Error("Review couldn't be found");
    error.status = 404;
    error.title = "Not Found"
    return error;
  }
}

const checkImageLimit = (images) => {
  if(images.length > 10){
    let error = new Error("Maximum number of images for this resource was reached");
    error.status = 403
    error.title = "Forbidden";
    return error;
  }
}

//Create a new Image for Review
router.post('/:reviewId/images',
  validateNewReviewImage,
  requireAuth,
  async (req, res, next) =>{
    const {id} = req.user;
    const {reviewId} = req.params;

    const review = await Review.findOne({
      where: {
        userId: id,
        id: reviewId
      },
      include:{
        model: Image,
        as: "ReviewImages",
        required: false,
        attributes: ["url"]
      }
    })

    //error handling to make sure user owns the review and if it exists
    const checkReview = checkIfReviewExists(review);
    if(checkReview) return next(checkReview);
    //error handling to see if ReviewImages has reached image limit
    const checkLimit = checkImageLimit(review.ReviewImages);
    if(checkLimit) return next(checkLimit);

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
  validateNewReview,
  requireAuth,
  async (req, res, next) => {
    const {reviewId} = req.params;

    const review = await Review.findByPk(reviewId);

    const checkReview = checkIfReviewExists(review);
    if(checkReview) return next(checkReview);

    await review.update(req.body);

    res.json(review)
  })

//Delete Review
router.delete("/:reviewId",
  requireAuth,
  async (req, res, next) => {
    const {id} = req.user
    const {reviewId} = req.params;

    const review = await Review.findOne({
      where:{
        userId: id,
        id: reviewId
      }
    });

    //error handling to make sure user owns the review and if it exists
    const checkReview = checkIfReviewExists(review);
    if(checkReview) return next(checkReview);

    await review.destroy()

    res.json({message: "Successfully deleted"})
  })

module.exports = router;
