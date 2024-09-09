import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpots, getUserSpots, selectAllSpotsArry, selectCurrentUserSpots} from '../../store/spots';
import SpotCard from "../SpotCard";
import './HomePage.css';



export const HomePage = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector(selectAllSpotsArry);
  const userSpots = useSelector(selectCurrentUserSpots);
  const sessionUser = useSelector(state => state.session.user);

  console.log(userSpots);

  useEffect(()=>{
    if(!sessionUser){
      dispatch(getSpots())
    }
    dispatch(getUserSpots())
  }, [dispatch, sessionUser])

  return(
    <main className="flex-container">
      {sessionUser ?
      userSpots.map(spot => <SpotCard key={spot.id} spot={spot}/>):
      allSpots.map(spot => <SpotCard key={spot.id} spot={spot}/>)
      }
    </main>
  )
}
