const Months =
['January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
]

export const SpotReviewList = ({review}) => {

  if(!review) return <div>Loading</div>

  const {User: {firstName}, createdAt} = review;
  const date = new Date(createdAt);
  const month = Months[date.getMonth()];
  const year = date.getFullYear()


  return(
    <li>
      <h4>{firstName}</h4>
      <h4 className="date">{`${month} ${year}`}</h4>
      <article>{review.review}</article>
    </li>
  );
}
