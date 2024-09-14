import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';
import { getUserReviews } from "./reviews";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_CURRENT_USER_SPOTS = 'spots/LOAD_CURRENT_USER_SPOTS';
const LOAD_SPOT_BY_ID = 'spots/LOAD_SPOT_BY_ID';
const LOAD_REVIEWS_OF_SPOT = 'spots/LOAD_REVIEWS_OF_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const CREATE_SPOT_IMAGE = 'spots/CREATE_SPOT_IMAGE';
const CREATE_REVIEW = 'spots/CREATE_REVIEW';
const DELETE_SPOT = 'spots/DELETE_SPOT';

//action creators

export const loadSpots = spots => (
  {
    type: LOAD_SPOTS,
    spots
  }
);

export const loadCurrentUserSpots = spots => (
  {
    type: LOAD_CURRENT_USER_SPOTS,
    spots
  }
)

export const loadSpotById = spot => (
  {
    type: LOAD_SPOT_BY_ID,
    spot
  }
)

export const loadReviewsOfSpot = reviews =>(
  {
    type: LOAD_REVIEWS_OF_SPOT,
    reviews
  }
)

export const createSpot = spot => (
  {
    type: CREATE_SPOT,
    spot
  }
)

export const createSpotImage = image => (
  {
    type: CREATE_SPOT_IMAGE,
    image
  }
)

export const createReview = review => (
  {
    type: CREATE_REVIEW,
    review
  }
)

export const deleteSpot = spotId => (
  {
    type: DELETE_SPOT,
    spotId
  }
)

//thunk action creators

export const getSpots = () => async dispatch => {
  const res = await csrfFetch('/api/spots');

  if(res.ok){
    const spots = await res.json();
    dispatch(loadSpots(spots.Spots))
  }
}

export const getUserSpots = () => async dispatch => {
  const res = await csrfFetch('/api/spots/current');

  if(res.ok){
    const spots = await res.json();
    dispatch(loadCurrentUserSpots(spots.Spots))
  }
}

export const getSpotById = spotId => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if(res.ok){
    const spot = await res.json();
    dispatch(loadSpotById(spot));
  }
}

export const getSpotReviews = spotId => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if(res.ok){
    const reviews = await res.json()
    dispatch(loadReviewsOfSpot(reviews.Reviews))
  }
}

export const addASpot = spot => async dispatch => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body : JSON.stringify(spot)
  })

  const newSpot = await res.json();
  if(res.ok){
    dispatch(createSpot(newSpot))
  }return newSpot;
}

export const addSpotImage = (spotId, image) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`,{
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(image)
    }
  )

  const newImage = await res.json();
  if(res.ok){
    dispatch(createSpotImage(newImage))
  }return newImage;
}

export const addAReview = (spotId, review) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(review)
  })

  if(res.ok){
    const newReview = await res.json();
    await dispatch(createReview(newReview))
    await dispatch(getUserReviews());
  }
}

export const removeSpot = spotId => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`,
    {
      method:'DELETE',
      headers: {'Content-Type': 'application/json'}
    }
  )

  if(res.ok) dispatch(deleteSpot(spotId))
}

//selectors

export const selectSpot = state => state.spot;

export const selectAllSpotsArry = createSelector(selectSpot, spot => Object.values(spot.allSpots));

export const selectCurrentUserSpots = createSelector(selectSpot, spot =>
  Object.values(spot.currentUserSpots) || []
)

export const selectSpotById = createSelector([selectSpot, (state, id) => id],
  (spot, id) => spot.allSpots[id]
)

//reducer

const initialState = {
  allSpots: {},
  currentUserSpots: {},
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const allSpots = {};
      action.spots.forEach(spot => allSpots[spot.id] = spot)
      return {...state, allSpots};
    }
    case LOAD_CURRENT_USER_SPOTS:{
      const currentUserSpots = {}
      action.spots.forEach(spot => {
        currentUserSpots[spot.id] = spot;
      });
      return { ...state, currentUserSpots}
    }
    case LOAD_SPOT_BY_ID: {
      const spot = action.spot
      return {
        ...state,
        allSpots: { ...state.allSpots, [spot.id]: spot }
      }
    }
    case LOAD_REVIEWS_OF_SPOT: {
      const reviews = action.reviews;
      const spotId = reviews[0].spotId
      const allReviews = {}
      if(reviews.length > 0){
        reviews.forEach(review => {
          allReviews[review.id] = review
        })
      }

      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [spotId]: {
            ...state.allSpots[spotId],
            reviews: allReviews,
          }
        }
      }
    }
    case CREATE_SPOT:{
      const spotId = action.spot.id;
      return {
        ...state,
        allSpots : {
          ...state.allSpots,
          [spotId]: action.spot
        }
      }
    }
    case CREATE_REVIEW:{
      const {spotId} = action.review
      const review = action.review
      const currentReviews = state.allSpots[spotId].reviews || {};
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [spotId]: {
            ...state.allSpots[spotId],
            reviews: {...currentReviews, [review.id]: review},
          },
        },
      };
    }
    case DELETE_SPOT:{
      const {spotId} = action
      const copyState = { ...state }
      delete copyState.currentUserSpots[spotId]
      return copyState;
    }
    default:
      return state;
  }
}

export default spotReducer;
