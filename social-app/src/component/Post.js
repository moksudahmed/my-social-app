// Post.js
import React, { useState, useEffect } from 'react';
import Comment from './Comment';

const Post = ({ post, onLike, onComment, onShare, accessToken, fetchPosts }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

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
          // Comment posted successfully, update the UI with the new comments
          const newComment = await response.json();
          setComments((prevComments) => [...prevComments, newComment]);
          setComment('');
          fetchPosts(); // Trigger the fetchPosts function to update the post list
        } else {
          console.error('Failed to post comment');
        }
      } catch (error) {
        console.error('Error during comment submission:', error);
      }
    }
  };

  return (
    <div className="post">
      <p>{post.content}</p>
      <div>
        <button onClick={onLike}>Like</button>
        <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
      </div>
      <button onClick={onComment}>Comment</button>
      <button onClick={onShare}>Share</button>

      <div>
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
            <Comment key={index} post_id ={post._id.$oid} comment={comment} accessToken={accessToken} fetchPosts={fetchPosts} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Post;
