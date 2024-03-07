import React, { useState, useEffect } from 'react';
import '../App.css';
import '../module.css';
import Post from '../component/post/Post';
//import PhotoPost from './component/PhotoPost'; // Import the new PhotoPost component
//import ImageUpload from './component/ImageUpload';
import PhotoUpload from '../component/PhotoUpload';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Feed = ({accessToken, loggedIn, type}) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showPhotoPost, setShowPhotoPost] = useState(false);
  console.log(type)
  const fetchPosts = async () => {
    try {
      let response;
      if (type === 'all') {
        response = await fetch(`${API_BASE_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        response = await fetch(`${API_BASE_URL}/posts-by-user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
  
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
            );
};

export default Feed;
