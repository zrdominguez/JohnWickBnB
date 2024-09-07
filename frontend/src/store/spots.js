import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';

//action creators
export const loadSpots = spots => (
  {
    type: LOAD_SPOTS,
    spots
  }
);

//thunk action creators
export const getSpots = () => async dispatch => {
  const res = await csrfFetch('/api/spots');

  if(res.ok){
    const spots = await res.json();
    dispatch(loadSpots(spots.Spots))
  }
}
//selectors

//reducer


const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = {};
      action.spots.forEach(spot => newState[spot.id] = spot)
      return newState;
    }
    default:
      return state;
  }
}

export default spotReducer;
