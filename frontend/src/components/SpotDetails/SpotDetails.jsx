import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById, getSpotReviews, selectSpotById } from "../../store/spots";
import { useEffect, useState } from "react";
import './SpotDetails.css';
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
<<<<<<< HEAD:frontend/src/SpotDetails/SpotDetails.jsx
//import { IoMdStarOutline } from "react-icons/io";
import SpotReviewList from "../components/SpotReviewList";
=======
import SpotReviewList from "../../components/SpotReviewList";
import { selectUserReviews } from "../../store/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { PostReviewModal } from "../PostReviewModal/PostReviewModal";
>>>>>>> dev:frontend/src/components/SpotDetails/SpotDetails.jsx

export const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => selectSpotById(state, spotId))
  const sessionUser = useSelector(state => state.session.user);
  const reviews = useSelector(selectUserReviews);
  const [displayNone, setDisplayNone] = useState(false);

  console.log(reviews)

  useEffect(()=>{
    reviews.forEach(review => {
      if(spotId == review.spotId) setDisplayNone(true);
    })
  },[spotId, displayNone, reviews])


  useEffect( () => {
    dispatch(getSpotById(spotId))
  }, [dispatch, spotId])

  useEffect( () => {
    if(spot?.numReviews) dispatch(getSpotReviews(spotId))
  }, [dispatch, spotId, spot?.numReviews])

  if(!spot || !spot.Owner || !spot.SpotImages) return <h3>Loading...</h3>

  const {
    name,
    city,
    state,
    country,
    Owner : {firstName, lastName},
    //SpotImages,
    numReviews,
    avgStarRating,
    price,
    description,
  } = spot

    const icon = avgStarRating >= 4 || avgStarRating == 0 ? <IoMdStar /> : <IoMdStarHalf />
    const previewImage = SpotImages.find(image => image.preview);
    const amenitiesPic = SpotImages.filter(image => !image.preview);
    let pics =[];
    for(let i = 0; i < 4; ++i){
      pics[i] = amenitiesPic[i] ? amenitiesPic[i] : 'https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
    }

  return(
    <div className="spot-container">
      <div className="spot-details">
        <h2>{name}</h2>
        <p>{`${city}, ${state}, ${country}`}</p>
        <section className="flex-container">
          <div className="preview-image">
            <img src={previewImage ? previewImage.url : 'https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}/>
          </div>
          <div className="grid-container">
          {pics.map((pic, index) => (
              <img className="grid-item" src= {pic.url ? pic.url: pic} key={pic.id ? pic.id : index}/>
            ))}
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
                <p>{icon}{numReviews ?
                `${avgStarRating.toFixed(1)} - ${numReviews} ${numReviews > 1 ? 'reviews' : 'review'}` : 'New'}
                </p>
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
      <div className="reviews">
        <h3>{icon}&nbsp;{numReviews ?
          `${avgStarRating.toFixed(1)} - ${numReviews} ${numReviews > 1 ? 'reviews' : 'review'}` : 'New'}
        </h3>
        {sessionUser && sessionUser.id != spot.ownerId ?
          <button
          id="post-review-btn"
          style={{display: displayNone ? 'none': 'flex'}}
          >
            <OpenModalMenuItem
            itemText="Post a review"
            modalComponent={<PostReviewModal spotId={spotId} setDisplayNone={setDisplayNone}/>}
            />
          </button>
          : null
        }
        {numReviews && !spot.reviews ?
          <div>Loading...</div>:
          (
          <>
            <div className="review-container">
              <ul>
                {
                numReviews > 0 ?
                Object.values(spot.reviews).map(review =>
                  <SpotReviewList review={review} key={review.id} />
                )
                : <p>Be the first to post a Review!</p>
                }
              </ul>
            </div>
          </>
          )
        }

      </div>
    </div>
  )
}
