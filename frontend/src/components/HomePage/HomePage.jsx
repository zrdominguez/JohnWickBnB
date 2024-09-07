import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpots } from '../../store/spots';
import SpotCard from "../SpotCard";
import './HomePage.css';



export const HomePage = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector(state => Object.values(state.spot));

  useEffect(()=>{
    dispatch(getSpots())
  }, [dispatch])

  return(
    <main className="flex-container">
      {allSpots.map(spot => <SpotCard key={spot.id} spot={spot}/>)}
    </main>
  )
}
