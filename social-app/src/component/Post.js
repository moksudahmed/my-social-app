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

const Post = ({ post }) => (
  <div style={postStyle}>
    <p>{post.content}</p>
    <div style={actionsStyle}>
      <button style={buttonStyle}>Like</button>
      <button style={buttonStyle}>Comment</button>
      <button style={buttonStyle}>Share</button>
    </div>
  </div>
);

export default Post;