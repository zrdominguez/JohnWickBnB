import SpotCard from '../SpotCard'
import './ManageSpots.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getSpotById, getUserSpots, removeSpot, selectCurrentUserSpots } from '../../store/spots'
import { NavLink, useNavigate} from 'react-router-dom'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import { useModal } from '../../context/Modal'
export const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSpots = useSelector(selectCurrentUserSpots)
  const {closeModal} = useModal()

  useEffect(() => {
    dispatch(getUserSpots())
  },[dispatch])

  const handleDelete = spotId => {
    dispatch(removeSpot(spotId)).then(closeModal)
    .catch(err => console.error(err));
  }



  return (
    <main className='main-container'>
      <div className='manage-heading'>
        <h1>Manage your spots</h1>
        {!userSpots.length && <NavLink to={'/spots/new'}><button>Create a new Spot</button></NavLink>}
      </div>
      <div className="manage-container">
        {userSpots && userSpots.map(spot =>
          <div className='card-container' key={spot.id}>
            <SpotCard spot={spot}/>
            <span className='update-delete'>
              <button onClick={async () => {
                  await dispatch(getSpotById(spot.id))
                  .then(()=> navigate(`/spots/${spot.id}/edit`))
                  .catch(err => console.error(err))
                }
              }>Update</button>
              <button>
                <OpenModalMenuItem
                itemText={'Delete'}
                modalComponent={
                  (
                    <div className='confirm-delete-modal'>
                      <h2>Confirm Delete</h2>
                      <p>Are you sure you want to remove this spot from the listings?</p>
                      <button id='yes-button' onClick={()=> handleDelete(spot.id)}>Yes (Delete spot)</button>
                      <button id='no-button' onClick={closeModal}>No (Keep Spot)</button>
                    </div>
                  )}
                />
              </button>
            </span>
          </div>
        )}
      </div>
    </main>
  )
}
