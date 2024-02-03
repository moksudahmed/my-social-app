// Registration.js

import React, { useState } from 'react';
import styles from '../module.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');

  const register = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, firstname,lastname }),
      });

      if (response.ok) {
        setRegistrationStatus('Registration successful');
        // Add a success message or redirect to the login page
      } else {
        const errorData = await response.json();
        setRegistrationStatus(`Registration failed: ${errorData.error}`);
        // Display an error message to the user
      }
    } catch (error) {
      setRegistrationStatus(`Error during registration: ${error.message}`);
      // Handle unexpected errors gracefully
    }
  };

  return (
    <div className={styles.registrationContainer}>
      <h1 className={styles.registrationHeader}>Create Your Account</h1>
      <form className={styles.registrationForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your First name"
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your Last name"
            className={styles.inputField}
          />
        </div>        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={styles.inputField}
          />
        </div>

        <button className={styles.registerButton} onClick={register}>
          Register
        </button>

        {registrationStatus && (
          <div className={styles.registrationStatus}>{registrationStatus}</div>
        )}
      </form>
    </div>
  );
};

export default Registration;
