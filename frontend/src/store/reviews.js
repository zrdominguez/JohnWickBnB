import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'

//action creators
export const loadReviews = reviews => (
  {
    type: LOAD_USER_REVIEWS,
    reviews
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

//selectors
const selectReview = state => state.review
export const selectUserReviews = createSelector(selectReview, review => Object.values(review.userReviews));

//reducer
const initialState = {userReviews:{}}

const reviewReducer = (state = initialState, action) => {
  switch (action.type){
    case LOAD_USER_REVIEWS: {
      const reviews = action.reviews.Reviews
      const userReviews = {}
      reviews.forEach(review=> {
        userReviews[review.id] = review
      })
      return {...state, userReviews}
    }
    default:
      return state;
  }
}


export default reviewReducer;
