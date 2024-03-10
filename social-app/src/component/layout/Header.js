import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppHeader.css';
import { Navigate } from 'react-router-dom';

const AppHeader = ({ accessToken, username, logout, loggedIn, searchTerm, setSearchTerm, setSearchResults, setIsSearch }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/get-profile-picture/WhatsApp_Image_2023-11-21_at_4.52.39_PM.jpeg', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'arraybuffer',
        });

        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

        setProfilePicture(imageDataUrl);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePicture();
  }, [accessToken]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_user_by_username/${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const searchData = response.data;
      setSearchResults(searchData.users);
      setIsSearch(true);
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  const handleUserProfileClick = () => {
    setShowUserProfile(true);
  };

  return (
    <header className="header">
      <div className="logo">SnapShare</div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button" onClick={handleSearchSubmit}>Search</button>
      </div>
      <div className="user-profile" onClick={handleUserProfileClick}>
        <div className="user-info">
          <div className="user-avatar">
            {profilePicture && <img src={profilePicture} alt="Profile Picture" />}
          </div>
          <div className="user-name">{username}</div>
        </div>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
      {showUserProfile && <Navigate to="/user-profile" state={{ accessToken: accessToken, loggedIn: loggedIn }} replace={true} />}
    </header>
  );
};

export default AppHeader;
