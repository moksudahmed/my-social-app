import React, { useState } from 'react';
import axios from 'axios';
import './AppHeader.css';
import image from '../../images/placeholder.jpg';
import UserProfile from '../user/UserProfile'; // Import the UserProfile component
import { Navigate } from "react-router-dom";
import UserProfilePage from '../../pages/UserProfilePage';

const AppHeader = ({ accessToken, username, logout, searchTerm, setSearchTerm, setSearchResults, setIsSearch }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);

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
    console.log("Clicked");
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
            {/* Placeholder for profile photo */}
            <img src={image} alt="Profile" />
          </div>
          <div className="user-name">{username}</div>
        </div>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
      {showUserProfile && <Navigate to="/user-profile" replace={true} />} {/* Render the UserProfile component if showUserProfile is true */}
    </header>
  );
};

export default AppHeader;
