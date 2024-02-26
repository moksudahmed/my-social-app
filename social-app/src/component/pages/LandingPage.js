import React from 'react';
import { PropTypes } from 'prop-types'; // Import PropTypes for type checking
import '../../App.css';
import '../../module.css';
import Registration from '../../component/Registration';
import Login from '../../component/Login';
import AppFooter from '../../component/layout/Footer';
import AppHeader from '../../component/layout/Header';
import LeftSidebar from '../../component/layout/LeftSidebar';
import RightSidebar from '../../component/layout/RightSidebar';
import axios from 'axios';
import Feed from '../../component/Feed';
import MainSection from '../layout/MainSection';

const API_BASE_URL = 'https://127.0.0.1:5000'; // Use HTTPS for secure API calls

const LandingPage = ({ accessToken, loggedIn, username, logout }) => {
  const onSearch = () => {
    // Implement search functionality
  };
  
  return (
    <div>
      <AppHeader accessToken={accessToken} username={username} logout={logout} onSearch={onSearch} />
      <div className="mainContent">
        <LeftSidebar accessToken={accessToken} loggedIn={loggedIn} />
        <main className="mainSection">
          <MainSection accessToken={accessToken} loggedIn={loggedIn} username={username} logout={logout} />
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
