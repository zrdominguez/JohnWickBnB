import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_CURRENT_USER_SPOTS = 'spots/LOAD_CURRENT_USER_SPOTS';
const LOAD_SPOT_BY_ID = 'spots/LOAD_SPOT_BY_ID';

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
    default:
      return state;
  }
}

export default spotReducer;
