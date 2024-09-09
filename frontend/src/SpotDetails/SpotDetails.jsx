import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById, selectSpotById } from "../store/spots";
import { useEffect } from "react";
import './SpotDetails.css';
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { IoMdStarOutline } from "react-icons/io";



export const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => selectSpotById(state, spotId))

  let icon;

  useEffect(() => {
    dispatch(getSpotById(spotId))
  }, [dispatch, spotId])

  if(!spot) return <h3>Loading...</h3>

  const {
    name,
    city,
    state,
    country,
    Owner : {firstName, lastName},
    SpotImages,
    numReviews,
    avgStarRating,
    price,
    description
  } = spot

  if(isNaN(0)) icon = <IoMdStarOutline />
  else {
    icon = 0 >= 4 ? <IoMdStar /> : <IoMdStarHalf />
  }


  return(
    <main>
      <div className="spot-details">
        <h2>{name}</h2>
        <p>{`${city}, ${state}, ${country}`}</p>
        <section className="flex-container">
          <div className="preview-image">
            <img src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"/>
          </div>
          <div className="grid-container">
            <img className="grid-item" src= 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'/>
            <img className="grid-item" src= 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'/>
            <img className="grid-item" src= 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'/>
            <img className="grid-item" src= 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'/>
          </div>
        </section>
        <section className="reserve-info">
          <div className="host-info">
            <h3>{`Hosted by ${firstName} ${lastName}`}</h3>
            <article>{description}</article>
          </div>
          <div className="reserve-cost">
            <ul>
              <li className="price-review">
                <h3>{`$${price} night`}</h3>
                <p>{icon}{`${avgStarRating}/5 - ${numReviews} reviews`}</p>
              </li>
              <li>
                <button
                className="reserve-button"
                onClick={()=>window.alert("Feature Coming Soon...")}
                >Reserve</button>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <div className="reviews"></div>
    </main>
  )
}
