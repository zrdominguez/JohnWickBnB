import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PostReviewModal.css';
import { IoMdStarOutline } from "react-icons/io";

export const PostReviewModal = () => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   return dispatch(.login({ credential, password }))
  //   .then(closeModal)
  //   .catch(async (res) => {
  //     const data = await res.json();
  //     if (data && data.errors) {
  //       setErrors(data.errors);
  //     }
  //   });
  // };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 >How Was Your Stay?</h1>
        <div>
          <textarea
            type="text"
            value={credential}
            placeholder='Just a quick review.'
            onChange={(e) => setReview(e.target.value)}
            required
          >
          </textarea>
        </div>
        <div>
          {[...Array(5)].map((el, i) => (
            <IoMdStarOutline key={i} id={`star${i}`}/>
          ))}
        </div>
        {/* {errors.credential && (
          <p>{errors.credential}</p>
        )} */}
        <button type="submit" id='submit-review-btn'>Submit Your Review</button>
      </form>
    </>
  );
}
