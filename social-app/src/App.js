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
import Dashboard from './dashboard';

const API_BASE_URL = 'http://127.0.0.1:5000';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPhotoPost, setShowPhotoPost] = useState(false);

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
      }
    };

    fetchData();
  }, [loggedIn, posts, fetchPosts]);

  return (
    <div>
      <Dashboard />
        </div>
  );
};

export default App;
