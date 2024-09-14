import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';
const DELETE_REVIEW = 'reviews/LOAD_USER_REVIEWS';

//action creators
export const loadReviews = reviews => (
  {
    type: LOAD_USER_REVIEWS,
    reviews
  }
)

export const deleteReview = reviewId => (
  {
    type: DELETE_REVIEW,
    reviewId
  }
)

//thunk action creators
export const getUserReviews = () => async dispatch => {
  const res = await csrfFetch('/api/reviews/current');

  if(res.ok){
    const userReviews = await res.json();
    dispatch(loadReviews(userReviews))
  }
}

export const removeReview = reviewId => async dispatch => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {'Content-Type':'application/json'}
  })

  if(res.ok){
    dispatch(deleteReview(reviewId))
  }
}

//selectors
const selectReview = state => state.review
export const selectUserReviews = createSelector(selectReview, review => Object.values(review.userReviews));

//reducer
const initialState = {userReviews:{}}

const reviewReducer = (state = initialState, action) => {
  switch (action.type){
    case LOAD_USER_REVIEWS: {
      const userReviews = {}
      if(action.reviews){
        const reviews = action.reviews.Reviews
        reviews.forEach(review=> {
          userReviews[review.id] = review
        })
        return {...state, userReviews}
      }
      return state
    }
    case DELETE_REVIEW:{
        const {reviewId} = action;
        const copyState = {...state }
        delete copyState.userReviews[reviewId]
        return copyState;
    }
    default:
      return state;
  }
}


export default reviewReducer;
