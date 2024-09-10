import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProfileButton } from './ProfileButton';
import { FaAirbnb } from "react-icons/fa";
import './Navigation.css';

export const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink
            to="/"
            className='home-link'>
              <FaAirbnb />
              <h3>The Continental</h3>
            </NavLink>
          </li>
          {isLoaded && (
            <li className='list-profile-button'>
              {sessionUser && <NavLink>Create a New Spot</NavLink>}
              <ProfileButton user={sessionUser} className='profile-button'/>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
