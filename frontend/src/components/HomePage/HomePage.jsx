import { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpots, selectAllSpotsArry } from '../../store/spots';
import SpotCard from "../SpotCard";
import './HomePage.css';



export const HomePage = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector(selectAllSpotsArry);

  useEffect(()=>{
    dispatch(getSpots())
  }, [dispatch])

  return(
    <div className="flex-container">
      {allSpots.map(spot => <SpotCard key={spot.id} spot={spot}/>)}
    </div>
  )
}
