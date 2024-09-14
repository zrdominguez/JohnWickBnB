import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { GiHamburgerMenu } from "react-icons/gi";
import { LuLogIn } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';


export const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className='profile-button'>
        <GiHamburgerMenu className='hamburger-icon' size={20} style={{color: '#c3ba6d'}}/>
        <FaUserCircle className='profile-icon' size={20}  style={{color: '#c3ba6d'}}/>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{`Hello, ${user.firstName}`}</li>
            <li>{user.email}</li>
            <li
            onClick={() => navigate('/spots/current')}
            style={
              {
                borderTop: '1px solid black',
                borderBottom: '1px solid black',
                cursor: 'pointer',
              }
            }
            >Manage Spots</li>
            <li className='logout-btn'>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemIcon={<LuLogIn />}
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemIcon={<LuPencil />}
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}
