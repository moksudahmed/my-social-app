import React, { useState, useEffect } from 'react';
import '../App.css';
import LandingPage from '../pages/LandingPage'; // Import LandingPage component
import Registration from '../component/auth/Registration'; // Import Registration component
import Login from '../component/auth/Login'; // Import Login component
import axios from 'axios';

const HomePage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');

  const fetchUser = async () => {
    console.log(accessToken)
    try {
      const response = await axios.get('http://127.0.0.1:5000/user/get_username', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsername(response.data.name);
      console.log(username)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setAccessToken('');
    localStorage.removeItem('accessToken'); // Clear accessToken from localStorage
  };

  useEffect(() => {
    const fetchData = async () => {
      // Check if there is an accessToken in localStorage
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        setLoggedIn(true);
        setAccessToken(storedToken);
      }
      await fetchUser();
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="mainContent">
        <main className="mainSection">
          {loggedIn ? (
            <LandingPage
              accessToken={accessToken}
              loggedIn={loggedIn}
              username={username}
              logout={logout}
            />
          ) : (
            <>
              {showRegistration ? (
                <Registration
                  setLoggedIn={setLoggedIn}
                  setAccessToken={setAccessToken}
                  setShowRegistration={setShowRegistration}
                />
              ) : (
                <>
                  {showLogin && (
                    <Login
                      setLoggedIn={setLoggedIn}
                      setAccessToken={setAccessToken}
                      setShowLogin={setShowLogin}
                    />
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
      </div>
    </div>
  );
};

export default HomePage;
