import React, { useState } from 'react';
import axios from 'axios';
import styles from './registration.css';
import { useLocation } from 'react-router-dom';
const API_BASE_URL = 'http://127.0.0.1:5000';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const location = useLocation();
  //const [profilePicture, setProfilePicture] = useState(image); // State for profile picture
  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleProfilePictureChange2 = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  // Function to handle profile picture change
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${location.state.accessToken}`,
        },
      });
      console.log('Profile picture uploaded successfully');
      // Update profile picture in UI
      setProfilePicture(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const register = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('profile_picture', profilePicture);

      const response = await axios.post(`${API_BASE_URL}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setRegistrationStatus('Registration successful');
        // Add a success message or redirect to the login page
      } else {
        setRegistrationStatus(`Registration failed: ${response.data.message}`);
        // Display an error message to the user
      }
    } catch (error) {
      setRegistrationStatus(`Error during registration: ${error.message}`);
      // Handle unexpected errors gracefully
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setProfilePicture(null);
    setRegistrationStatus('');
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

        <div className={styles.nameGroup}>
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

        <div className={styles.formGroup}>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className={styles.inputField}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.registerButton} onClick={register}>
            Register
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>

        {registrationStatus && (
          <div className={styles.registrationStatus}>{registrationStatus}</div>
        )}
      </form>
    </div>
  );
};

export default Registration;
