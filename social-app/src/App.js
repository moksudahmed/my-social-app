import React, { useState, useEffect } from 'react';
import './App.css'; // Import your global styles here
import './module.css'
import Post from './component/Post';
import Registration from './component/Registration';
import Login from './component/Login';

const API_BASE_URL = 'http://127.0.0.1:5000';

const AppHeader = () => (
  <header className="header">
    <h1 className="logo">Your Logo</h1>
    {/* Add other header content */}
  </header>
);

const AppFooter = () => (
  <footer className="footer">
    <h1>Footer</h1>
    {/* Add footer content */}
  </footer>
);

const LeftSidebar = () => (
  <aside className="leftSidebar">
    <h1>Left Sidebar</h1>
    {/* Add left sidebar content */}
  </aside>
);

const RightSidebar = () => (
  <aside className="rightSidebar">
    <h1>Right Sidebar</h1>
    {/* Add right sidebar content */}
  </aside>
);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error during fetching posts:', error);
    }
  };

  const createPost = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (response.ok) {
        setNewPostContent('');
        fetchPosts();
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error during creating post:', error);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setAccessToken('');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn && posts.length === 0) {
        await fetchPosts();
      }
    };

    fetchData();
  }, [loggedIn, posts, fetchPosts]);

  return (
    <div className="appContainer">
      <AppHeader />
      <div className="mainContent">
        <LeftSidebar />
        <main className="mainSection">
          {loggedIn ? (
            <div>
              <h1 className="welcomeHeader">Welcome, User!</h1>
              <div className="logoutSection">
                <button className="logoutButton" onClick={logout}>
                  Logout
                </button>
              </div>
              <div className="newPostSection">
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="postInput"
                />
                <button className="postButton" onClick={createPost}>
                  Post
                </button>
              </div>
              <div className="postContainer">
                <h2>Posts</h2>
                {posts.map((post) => (
                  <Post key={post._id.$oid} post={post} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {showRegistration ? (
                <Registration setLoggedIn={setLoggedIn} setAccessToken={setAccessToken} />
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
        <RightSidebar />
      </div>
      <AppFooter />
    </div>
  );
};

export default App;
