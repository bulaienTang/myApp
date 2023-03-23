import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to the backend to check if the login information is correct
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const response = await res.json();
    console.log(response);
    if (response.success) {
      // Store the user's login information in the session storage
      sessionStorage.setItem('isLoggedIn', true);
      sessionStorage.setItem('username', username);
      navigate('/labels');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h1 className='login-h1'>Login</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <label>
          Username:
          <input className='input' type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input className='input' type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button className='submit' type="submit">Login / Sign Up</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
