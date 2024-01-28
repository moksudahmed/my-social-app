// App.js

import React, { useState, useEffect } from 'react';
import styles from './App.module.css';

const API_BASE_URL = 'http://localhost:5000';

const PostCard = ({ post }) => (
  <div className={styles.postCard} key={post._id.$oid}>
    <p>{post.content}</p>
    <div className={styles.postActions}>
      <button>Like</button>
      <button>Comment</button>
      <button>Share</button>
    </div>
  </div>
);

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');

  const register = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Registration successful');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
        setLoggedIn(true);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn && posts.length === 0) {
        await fetchPosts();
      }
    };

    fetchData();
  }, [loggedIn, posts, fetchPosts]);

  return (
    <div className={styles.appContainer}>
      {loggedIn ? (
        <div>
          <h1 className={styles.welcomeHeader}>Welcome, {username}!</h1>
          <div className={styles.newPostSection}>
            <input
              type="text"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
            />
            <button className={styles.postButton} onClick={createPost}>
              Post
            </button>
          </div>
          <div className={styles.postContainer}>
            <h2>Posts</h2>
            {posts.map((post) => (
              <PostCard key={post._id.$oid} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.authenticationSection}>
          <h1>Register</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className={styles.actionButton} onClick={register}>
            Register
          </button>
          <h1>Login</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className={styles.actionButton} onClick={login}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
