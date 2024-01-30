import React, { useState, useEffect } from 'react';

const postStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
};

const actionsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '8px',
};

const buttonStyle = {
  padding: '8px',
  margin: '0 4px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const Post = ({ post, onLike, onComment, onShare, accessToken }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Set initial comments when the component mounts
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
  
        console.log('Comment API Response:', response);
  
        if (response.ok) {
          // Comment posted successfully, update the UI with the new comments
          const newComment = await response.json();
          setComments((prevComments) => [...prevComments, newComment]);
          setComment('');
         
          console.log('New Comment:', comments);
        } else {
          console.error('Failed to post comment');
        }
      } catch (error) {
        console.error('Error during comment submission:', error);
      }
    }
  };
  
  
  
  const commentPost = async () => {
    try {
      // Assuming you have a route for comments like '/posts/:postId/comments'
      const commentUrl = `/posts/${post._id.$oid}/comments`;

      // Navigate to the comment page or open a comment dialog
      window.location.href = commentUrl;

      // If you are using a modal/dialog library, you can trigger the modal here
      // Example using a hypothetical modal library
      // openCommentDialog(postId);
    } catch (error) {
      console.error('Error while navigating to comment page:', error);
    }
  };

  return (
    <div style={postStyle} className="post">
      <p>{post.content}</p>
      <div style={actionsStyle}>
        <div>
          <button style={buttonStyle} onClick={onLike}>
            Like
          </button>
          <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        </div>
        <div>
          <button style={buttonStyle} onClick={commentPost}>
            Comment
          </button>
          <button style={buttonStyle} onClick={onShare}>
            Share
          </button>
        </div>
      </div>
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
            <li key={index}>{comment.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Post;
