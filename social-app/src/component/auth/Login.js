import React, { useState } from 'react';
import styles from './module.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Login = ({ setLoggedIn, setShowLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store accessToken in localStorage
        localStorage.setItem('accessToken', data.access_token);
        setLoggedIn(true);
        setShowLogin(false);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={styles.authenticationSection}>
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className={styles.actionButton} onClick={login}>
        Login
      </button>
    </div>
  );
};

export default Login;
