// Comment.js
import React from 'react';

const Like = ({ comments, comment, handleCommentChange, handleCommentSubmit }) => {
  return (
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
  );
};

export default Comment;
