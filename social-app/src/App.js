import React, { useState, useEffect } from 'react';
import './App.css';
import './module.css';
import Post from './component/Post';
import Registration from './component/Registration';
import Login from './component/Login';
import AppFooter from './component/layout/Footer'
import AppHeader from './component/layout/Header';
import LeftSidebar from './component/layout/LeftSidebar';
import RightSidebar from './component/layout/RightSidebar';
//import PhotoPost from './component/PhotoPost'; // Import the new PhotoPost component
//import ImageUpload from './component/ImageUpload';
import PhotoUpload from './component/PhotoUpload';
import UserInfo from './component/UserInfo';
import User from './component/User';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPhotoPost, setShowPhotoPost] = useState(false);
  const [username, setUserName]= useState()
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
        console.log(data);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error during fetching posts:', error);
    }
  };

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

  const handlePhotoPost = async (content) => {
    console.log(content);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
         // content_type: contentType,
          content: content,
        }),
      });
      
      if (response.ok) {
       // console.log('Photo Post:', { content });
        setShowPhotoPost(false);
        fetchPosts();
      } else {
        console.error('Failed to post photo');
      }
    } catch (error) {
      console.error('Error during photo post submission:', error);
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ post_id: postId }),
      });
      
      if (response.ok) {
        await fetchPosts();
      } else {
        console.error('Failed to like post');
      }
    } catch (error) {
      console.error('Error during liking post:', error);
    }
  };

  const commentPost = async (postId) => {
    console.log(`Commented on post with ID: ${postId}`);
    // Implement the logic to open a comment dialog or navigate to a comment page
  };

  const sharePost = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      } else {
        console.error('Failed to share post');
      }
    } catch (error) {
      console.error('Error during sharing post:', error);
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
        await fetchUser();
      }
    };

    fetchData();    
  }, [loggedIn, posts, fetchPosts]);

  return (
    <div className="appContainer">
      <AppHeader />
      <div className="mainContent">
        <LeftSidebar accessToken={accessToken} loggedIn={loggedIn}/>
        <main className="mainSection">
          {loggedIn ? (
            <div>
              <h1 className="welcomeHeader">Welcome to , {username}<User username={username}/></h1>
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

                {/* New button for posting photos */}
                <button className="postButton" onClick={() => setShowPhotoPost(true)}>
                  Post Photo
                </button>
              </div>

              {/* Display the PhotoPost component when showPhotoPost is true */}
              {showPhotoPost && <PhotoUpload onPost={handlePhotoPost} accessToken={accessToken} fetchPosts ={fetchPosts} />}

              <div className="postContainer">
                <h2>Posts</h2>
                {posts.map((post) => (
                  <Post
                    key={post._id.$oid}
                    post={post}
                    onLike={() => likePost(post._id.$oid)}
                    onComment={() => commentPost(post._id.$oid)}
                    onShare={() => sharePost(post._id.$oid)}
                    accessToken={accessToken}
                    fetchPosts={fetchPosts}
                    post_user={post.user_id.$oid}
                  />
                ))}
              </div>
            </div>
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

export default App;
