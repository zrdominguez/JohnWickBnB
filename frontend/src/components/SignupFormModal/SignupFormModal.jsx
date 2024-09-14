import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

export const SignupFormModal = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1 id='sign-up'>Sign Up</h1>
      <form
      className='sign-up-form'
      onSubmit={handleSubmit}
      >
        <label>
          <input
            type="text"
            value={firstName}
            placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}

          />
        </label>
        {errors.firstName && <p style={{color: 'red'}}>errors.firstName</p>}
        <label>
          <input
            type="text"
            value={lastName}
            placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}

          />
        </label>
        {errors.lastName && <p style={{color: 'red'}}>errors.lastName</p>}
        <label>
          <input
            type="text"
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}

          />
        </label>
        {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
        <label>
          <input
            type="text"
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}

          />
        </label>
        {errors.username && <p style={{color: 'red'}}>{errors.username}</p>}
        <label>
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}

          />
        </label>
        {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
        <label>
          <input
            type="password"
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}

          />
        </label>
        {errors.confirmPassword && (
          <p style={{color: 'red'}}>{errors.confirmPassword}</p>
        )}
        <button
        type="submit"
        id='sign-up-btn'
        disabled={
          !email || username.length < 4 || password.length < 6 || !confirmPassword || !firstName || !lastName

        }
        >Sign Up</button>
      </form>
    </>
  );
}
