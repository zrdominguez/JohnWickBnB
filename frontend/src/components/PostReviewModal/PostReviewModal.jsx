import { useState } from 'react';
import { useDispatch } from 'react-redux';
import './PostReviewModal.css';
import { IoMdStarOutline } from "react-icons/io";
import { IoMdStar } from 'react-icons/io';
import { addAReview } from '../../store/spots';
import { useModal } from '../../context/Modal';

export const PostReviewModal = ({spotId, setDisplayNone}) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [clicked, setClicked] = useState(false);
  const {closeModal} = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newReview =
    {
      review,
      stars: rating
    }
    await dispatch(addAReview(spotId, newReview))
    .then(() => {
      setDisplayNone(true);
      closeModal();
    })
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
  };

  return (
    <>
      <form
      className='review-modal'
      onSubmit={handleSubmit}
      >
        <h1>How Was Your Stay?</h1>
        {errors.review && (
          <p>{errors.review}</p>
        )}
        {errors.stars && (
          <p>{errors.stars}</p>
        )}

        <textarea
          type="text"
          value={review}
          placeholder='Just a quick review.'
          onChange={(e) => setReview(e.target.value)}
          required
        >
        </textarea>

        <div className='star-rating'>
          <div>
            {[...Array(5)].map((el, i) => (
               <span
               key={i}
               onClick={() => {
                setRating(i + 1)
                setClicked(true)
               }
              }
               style={{ cursor: 'pointer' }}
               >
               {rating >= (i + 1) ? (
                 <IoMdStar
                 id={`full-star${i + 1}`}
                 onMouseLeave={() => {
                  if(!clicked){
                    setRating(i)
                  }setClicked(false)
                 }}
                 />
               ) : (
                 <IoMdStarOutline
                  id={`star${i + 1}`}
                  onMouseOver={()=> setRating(i + 1)}
                  />
               )}
             </span>
            ))}
          </div>
          <p>Stars</p>
        </div>
        <button
        type="submit"
        id='submit-review-btn'
        disabled={review.length < 10}
        >Submit Your Review</button>
      </form>
    </>
  );
}
