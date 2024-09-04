import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProfileButton } from './ProfileButton';
import './Navigation.css';

export const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}
