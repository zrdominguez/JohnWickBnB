const Months =
['January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
]

export const SpotReviewList = ({review, spotName}) => {

  if(!review || !review.User) return <div>Loading</div>

  const {User: {firstName}, createdAt} = review;
  const date = new Date(createdAt);
  const month = Months[date.getMonth()];
  const year = date.getFullYear()


  return(
    <>
      <h4>{spotName ? spotName : firstName}</h4>
      <h4 className="date">{`${month} ${year}`}</h4>
      <article>{review.review}</article>
    </>
  );
}
