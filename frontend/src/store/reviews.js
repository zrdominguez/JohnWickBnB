import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'

//action creators
export const loadReviews = reviews => (
  {
    type: LOAD_REVIEWS,
    reviews
  }
)

//thunk action creators

//selectors

//reducer

// const reviewReducer = (state = initialState, action) => {
//   switch (action.type){
//     case LOAD_REVIEWS: {
//       const
//     }
//   }
// }


// export default reviewReducer;
