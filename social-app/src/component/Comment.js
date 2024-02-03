import React, { useState } from 'react';
import UserInfo from './UserInfo';

const Comment = ({ post_id, comment, accessToken, fetchPosts, userId }) => {
  const [reply, setReply] = useState('');

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    console.log('Comment object:', comment); // Log the comment object
    
    if (reply.trim() !== '') {
      try {
        const commentUserId = comment.user_id && comment.user_id.$oid;
        const postId = comment.post_id; // Check if post_id is defined
       
        if (!commentUserId || !post_id) {
          console.error('Comment ID or Post ID is undefined.');
          return;
        }
        
        const response = await fetch('http://127.0.0.1:5000/posts/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            post_id: post_id,
            comment_id: commentUserId,
            text: reply,
          }),
        });

        if (response.ok) {
          // Reply posted successfully, update the UI with the new reply
          const newReply = await response.json();
          // Add logic to update the nested replies in your data structure
          setReply('');
          fetchPosts(); // Trigger the fetchPosts function to update the post list
        } else {
          console.error('Failed to post reply');
        }
      } catch (error) {
        console.error('Error during reply submission:', error);
      }
    }
  };

  return (
    <li>
      <p><UserInfo userId={userId}/>{comment.text}</p>
      <div>
        {/* Like button and count */}
        <span>Reply</span>
      </div>
      <form onSubmit={handleReplySubmit}>
        <input
          type="text"
          placeholder="Add a reply..."
          value={reply}
          onChange={handleReplyChange}
        />
        <button type="submit">Reply</button>
      </form>
      {/* Display nested replies */}
      <ul>
        {comment.replies &&
          comment.replies.map((reply, index) => (
            <Comment key={index} comment={reply} accessToken={accessToken} fetchPosts={fetchPosts} userId={userId}/>
          ))}
      </ul>
    </li>
  );
};

export default Comment;
