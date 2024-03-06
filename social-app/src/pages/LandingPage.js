import React, { useState } from 'react';
import { PropTypes } from 'prop-types'; // Import PropTypes for type checking
import '../App.css';
import '../module.css';

import AppFooter from '../component/layout/Footer';
import AppHeader from '../component/layout/Header';
import LeftSidebar from '../component/layout/LeftSidebar';
import RightSidebar from '../component/layout/RightSidebar';
import axios from 'axios';
import Feed from '../component/Feed';
import MainSection from '../component/layout/MainSection';
import Registration from '../component/auth/Registration';
import Login from '../component/auth/Login';

const API_BASE_URL = 'https://127.0.0.1:5000'; // Use HTTPS for secure API calls

const LandingPage = ({ accessToken, loggedIn, username, logout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  
  return (
    <div>
      <AppHeader accessToken={accessToken} username={username} logout={logout} loggedIn={loggedIn} searchTerm={searchTerm} setSearchTerm = {setSearchTerm} setSearchResults={setSearchResults} setIsSearch={setIsSearch}/>      
      <div className="mainContent">
        <LeftSidebar accessToken={accessToken} loggedIn={loggedIn} />
        <main className="mainSection">
          <MainSection accessToken={accessToken} loggedIn={loggedIn} username={username} searchResults={searchResults} setIsSearch={setIsSearch} isSearch={isSearch}/>
        </main>
        <RightSidebar accessToken={accessToken} loggedIn={loggedIn} />
      </div>
      <AppFooter accessToken={accessToken} />
    </div>
  );
};

// Add prop type validation
LandingPage.propTypes = {
  accessToken: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

export default LandingPage;
