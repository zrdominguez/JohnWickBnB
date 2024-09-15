import { useDispatch, useSelector } from "react-redux"
import SpotReviewList from "../SpotReviewList"
import { getUserReviews, removeReview, selectUserReviews } from "../../store/reviews"
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useEffect } from "react";
import './ManageReviews.css';

export const ManageReviews = () => {
  const reviews = useSelector(selectUserReviews)
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  useEffect(() => {
    dispatch(getUserReviews())
  }, [dispatch])

  const handleDelete = reviewId =>{
    dispatch(removeReview(reviewId))
    dispatch(getUserReviews())
  }

  return (
    <div className="manage-reviews">
      <ul
      style={{listStyle: 'none'}}
      className="manage-reviews-list"
      >
        { reviews.map(review => (
          <li key={review.id}>
            <SpotReviewList  review={review} spotName={review.Spot.name} />
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
                        handleDelete(review.id)
                        closeModal();
                        }
                      }>Yes (Delete Review)</button>
                      <button id='no-button' onClick={closeModal}>No (Keep Review)</button>
                    </div>
                  )}
                />
              </button>
            </span>
          </li>
        ))
        }
      </ul>
    </div>
  )
}
