// Post.js
import React, { useState, useEffect } from 'react';
import Comment from '../Comment';
//import PhotoPost from './PhotoPost';
import ImageViewer from '../ImageViewer';
import UserInfo from '../user/UserInfo';
import './post.css';

const Post = ({ post, onLike, onComment, onShare, accessToken, fetchPosts, post_user }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showPhotoPost, setShowPhotoPost] = useState(false);

  useEffect(() => {
    if (post && post.comments) {
      setComments(post.comments);
    }
  }, [post]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      try {
        const response = await fetch('http://127.0.0.1:5000/posts/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            post_id: post._id.$oid,
            text: comment,
          }),
        });

        if (response.ok) {
          const newComment = await response.json();
          setComments((prevComments) => [...prevComments, newComment]);
          setComment('');
          fetchPosts();
        } else {
          console.error('Failed to post comment');
        }
      } catch (error) {
        console.error('Error during comment submission:', error);
      }
    }
  };

  const handlePhotoPost = async (contentType, content) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/posts/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          post_id: post._id.$oid,
          content_type: contentType,
          content: content,
        }),
      });

      if (response.ok) {
        setShowPhotoPost(false);
        fetchPosts();
      } else {
        console.error('Failed to post photo');
      }
    } catch (error) {
      console.error('Error during photo post submission:', error);
    }
  };

  return (
    <div className="post">
      <UserInfo userId={post_user} />
      {post.content_type === 'text' && <p>{post.content}</p>}
      {post.content_type === 'photo' && <ImageViewer imagesData={post.content}/>}
      <div className="post-actions">
        <button onClick={onLike}>Like</button>
        <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        <span>{post.content.filename}</span>
      </div>
      <div className="post-buttons">
        <button onClick={onComment}>Comment</button>
        {/*<button onClick={() => setShowPhotoPost(true)}>Post Photo</button>*/}
      </div>

     {/* {showPhotoPost && <PhotoPost onPost={handlePhotoPost} />}*/}

      <div className="post-comments">
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={handleCommentChange}
          />
          <button type="submit">Post</button>
        </form>
        <ul>
          {comments.map((comment, index) => (
            <Comment key={index} post_id={post._id.$oid} comment={comment} accessToken={accessToken} fetchPosts={fetchPosts} userId={post_user}/>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Post;
