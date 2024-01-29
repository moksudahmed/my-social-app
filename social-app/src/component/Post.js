import React from 'react';
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

// Post.js


const Post = ({ post, onLike, onComment, onShare }) => {
  return (
    <div className="post">
      <p>{post.content}</p>
      <div>
        <button onClick={onLike}>Like</button>
        <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
      </div>
      <button onClick={onComment}>Comment</button>
      <button onClick={onShare}>Share</button>
    </div>
  );
};

export default Post;
