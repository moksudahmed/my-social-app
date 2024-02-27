import React, { useState, useEffect } from 'react';
import '../../App.css';
import '../../module.css';
import Registration from '../../component/Registration';
import Login from '../../component/Login';
import AppFooter from '../../component/layout/Footer'
import AppHeader from '../../component/layout/Header';
import LeftSidebar from '../../component/layout/LeftSidebar';
import RightSidebar from '../../component/layout/RightSidebar';
//import PhotoPost from './component/PhotoPost'; // Import the new PhotoPost component
//import ImageUpload from './component/ImageUpload';
import axios from 'axios';
import Feed from '../../component/Feed';

const API_BASE_URL = 'http://127.0.0.1:5000';

const LandingPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUserName]= useState();
  const [userData, setUserData] =useState([]);
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/user/get_username', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data.name)
      setUserName(response.data.name);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };
  const onSearch=()=>{

  }
  const logout = () => {
    setLoggedIn(false);
    setAccessToken('');
  };

  useEffect(() => {
    const fetchData = async () => {
        await fetchUser();
    };

    fetchData();    
  }, [loggedIn]);

  return (
    <div className="appContainer">
      <AppHeader accessToken={accessToken} username={username} logout={logout} onSearch={onSearch}/>
      <div className="mainContent">
        <LeftSidebar accessToken={accessToken} loggedIn={loggedIn}/>
        <main className="mainSection">
          {loggedIn ? (
            <Feed accessToken={accessToken} 
            loggedIn={loggedIn} 
            username={username} 
            logout={() => logout()}
            />
          ) : (
            <>
              {showRegistration ? (
                <Registration setLoggedIn={setLoggedIn} setAccessToken={setAccessToken} setShowRegistration={setShowRegistration} />
              ) : (
                <>
                  {showLogin && (
                    <Login setLoggedIn={setLoggedIn} setAccessToken={setAccessToken} setShowLogin={setShowLogin} />
                  )}
                  <div className="loginSection">
                    <button className="loginButton" onClick={() => setShowLogin(true)}>
                      Login
                    </button>
                  </div>
                  <div className="registrationLink">
                    <button className="registrationLinkButton" onClick={() => setShowRegistration(true)}>
                      Register
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </main>
        <RightSidebar accessToken={accessToken} loggedIn={loggedIn}/>
      </div>
      <AppFooter accessToken={accessToken}/>
    </div>
  );
};

export default LandingPage;
