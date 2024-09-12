import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpotCard.css'
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
//import { IoMdStarOutline } from "react-icons/io";

export const SpotCard = ({spot: {
  id,
  previewImage,
  state,
  city,
  avgRating,
  price
} }) =>{
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate();

  const icon = avgRating >= 4 || avgRating == 0 ? <IoMdStar /> : <IoMdStarHalf />


  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
  };

  const handleSpotClick = () => {
    navigate(`/spots/${id}`)
  }

  return (
    <div className="flex-item">
      <div className='image-container'>
        {loaded || <h2>Loading...</h2>}
        <img
        style={loaded ? {} : {display:'none'}}
        src={previewImage}
        alt="Preview Image"
        onError={handleError}
        onClick={handleSpotClick}
        onLoad={()=> setLoaded(true)}
        />
      </div>
      <ul>
        <li
        id="city-state"
        >
          <p>{`${city}, ${state}`}</p>
          <p
          style={{display:'flex', alignItems: "center"}}
          >
            {icon}
            {avgRating ? `${avgRating.toFixed(1)}` : 'New'}</p>
        </li>
        <li
        id="price"
        >{`$${price} night`}</li>
      </ul>
    </div>
  )
}
