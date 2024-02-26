import React, { useState } from 'react';
import axios from 'axios';
import SearchResults from './SearchResults';

const AppHeader = ({ accessToken, username, logout, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  return (
    <header className="header">
      <div className="logo">SnapShare</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchSubmit}>Search</button>
        <SearchResults results={searchResults} />
      </div>
      <div className="user-profile">
        <div className="user-info">
          <div className="user-avatar">
            {/* Placeholder for profile photo */}
            <img src="placeholder.jpg" alt="Profile" />
          </div>
          <div className="user-name">{username}</div>
        </div>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
