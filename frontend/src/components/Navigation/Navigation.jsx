import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProfileButton } from './ProfileButton';
import { FaAirbnb } from "react-icons/fa";
import './Navigation.css';

export const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <ul>
        <li className='home-link'>
          <FaAirbnb />The Continental
          <NavLink to="/" ></NavLink>
        </li>
        {isLoaded && (
          <li className='list-profile-button'>
            <ProfileButton user={sessionUser} className='profile-button'/>
          </li>
        )}
      </ul>
    </nav>
  );
}
