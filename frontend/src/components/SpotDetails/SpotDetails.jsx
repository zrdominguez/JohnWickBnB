import { useDispatch, useSelector } from "react-redux";
import { getSpotById, getSpotReviews, selectSpotById } from "../../store/spots";
import { useEffect, useState } from "react";
import './SpotDetails.css';
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import SpotReviewList from "../../components/SpotReviewList";
import { selectUserReviews, removeReview, getUserReviews } from "../../store/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { PostReviewModal } from "../PostReviewModal/PostReviewModal";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";

export const SpotDetails = () => {
  const {spotId} = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => selectSpotById(state, spotId))
  const sessionUser = useSelector(state => state.session.user);
  const reviews = useSelector(selectUserReviews);
  const [displayNone, setDisplayNone] = useState(false);
  const {closeModal} = useModal();



  useEffect( () => {
    if(spotId) {
      dispatch(getSpotById(spotId));
    }
  }, [dispatch, spotId, reviews])

  useEffect( () => {
      dispatch(getSpotReviews(spotId));
      reviews.forEach(review => {
        if(spotId == review.spotId) setDisplayNone(true);
      })
  }, [dispatch, spotId, spot?.numReviews, reviews])

  const handleDelete = reviewId =>{
    dispatch(removeReview(reviewId))
    dispatch(getUserReviews())
  }

  if(!spot || !spot.Owner || !spot.SpotImages) return <h3>Loading...</h3>

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
                <div id="rating-icon-reviews">
                  <p>{icon}</p>
                  {numReviews > 0 ?
                  <span>
                    <p>{avgStarRating.toFixed(1)}</p>&nbsp;
                    <p
                    style={{marginBottom: '8px'}}
                    >.</p>&nbsp;
                    <p>{numReviews}&nbsp;{numReviews > 1 ? 'reviews' : 'review'}</p>
                  </span> : 'New'}
                </div>
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
        <div id="heading-review-count">
          <h3>{icon}</h3>&nbsp;
          {numReviews > 0 ?
          <>
            <h3>{avgStarRating.toFixed(1)}</h3>&nbsp;
            <h3
            style={{marginBottom: '8px'}}
            >.</h3>&nbsp;
            <h3>{numReviews} {numReviews > 1 ? 'reviews' : 'review'}</h3>
          </> : 'New'
          }
        </div>
        {sessionUser && sessionUser.id != spot.ownerId && !displayNone?
          <button
          id="post-review-btn"
          >
            <OpenModalMenuItem
            itemText="Post a review"
            modalComponent={<PostReviewModal spotId={spotId} setDisplayNone={setDisplayNone}/>}
            />
          </button>
          : null
        }
        {numReviews > 0 && !spot.reviews ?
          <div>Loading...</div>:
          (
          <>
            <div className="review-container">
              <ul>
                {
                numReviews > 0  && spot.reviews?
                Object.values(spot.reviews).map(review =>
                <li key={review.id}>
                  <SpotReviewList review={review} />
                  {review.User.id == sessionUser?.id &&
                  <span className="update-delete">
                    <button>Update</button>
                    <button>
                    <OpenModalMenuItem
                    itemText={'Delete'}
                    modalComponent={
                    (
                    <div className='confirm-delete-modal'>
                      <h2>Confirm Delete</h2>
                      <p>Are you sure you want to delete this review?</p>
                      <button id='yes-button' onClick={()=> {
                        handleDelete(review.id);
                        setDisplayNone(false);
                        closeModal();
                        }
                      }>Yes (Delete Review)</button>
                      <button id='no-button' onClick={closeModal}>No (Keep Review)</button>
                    </div>
                    )}
                    />
                    </button>
                  </span>}
                </li>
                )
                : spot.ownerId == sessionUser?.id ? null : <p>Be the first to post a Review!</p>
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
