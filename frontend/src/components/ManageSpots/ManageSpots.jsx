import SpotCard from '../SpotCard'
import './ManageSpots.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getUserSpots, removeSpot, selectCurrentUserSpots } from '../../store/spots'
import { NavLink, useParams } from 'react-router-dom'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import { useModal } from '../../context/Modal'
export const ManageSpots = () => {
  const dispatch = useDispatch();
  const userSpots = useSelector(selectCurrentUserSpots)
  const {closeModal} = useModal()

  useEffect(() => {
    dispatch(getUserSpots())
  },[dispatch])

  const handleDelete = spotId => {

    console.log(spotId);
    dispatch(removeSpot(spotId)).then(closeModal)
    .catch(err => console.error(err));
  }



  return (
    <main className='main-container'>
      <div className='manage-heading'>
        <h1>Manage your spots</h1>
        {!userSpots.length && <NavLink to={'/spots/new'}><button>Create a new Spot</button></NavLink>}
      </div>
      <div className="flex-container">
        {userSpots && userSpots.map(spot =>
          <div className='card-container' key={spot.id}>
            <SpotCard spot={spot}/>
            <span className='update-delete'>
              <button>Update</button>
              <button>
                <OpenModalMenuItem
                itemText={'Delete'}
                modalComponent={
                  (
                    <>
                      <h2>Confirm Delete</h2>
                      <p>Are you sure you want to remove this spot from the listings?</p>
                      <button id='yes-button' onClick={()=> handleDelete(spot.id)}>Yes (Delete spot)</button>
                      <button id='no-button' onClick={closeModal}>No (Keep Spot)</button>
                    </>
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
