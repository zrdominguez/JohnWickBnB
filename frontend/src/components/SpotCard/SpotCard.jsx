import { useNavigate } from 'react-router-dom';
import './SpotCard.css'
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { IoMdStarOutline } from "react-icons/io";

export const SpotCard = ({spot: {
  id,
  previewImage,
  state,
  city,
  avgRating,
  price
} }) =>{
  const navigate = useNavigate();

  let icon;
  if(isNaN(avgRating)) icon = <IoMdStarOutline />
  else {
    icon = avgRating >= 4 ? <IoMdStar /> : <IoMdStarHalf />
  }

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';
  };

  const handleSpotClick = () => {
    navigate(`/spots/${id}`)
  }

  return (
    <div className="flex-item">
      <div className='image-container'>
        <img
        src={previewImage ? previewImage : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
        alt="Preview Image"
        onError={handleError}
        onClick={handleSpotClick}
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
            {`${avgRating}/5`}</p>
        </li>
        <li
        id="price"
        >{`$${price} night`}</li>
      </ul>
    </div>
  )
}
