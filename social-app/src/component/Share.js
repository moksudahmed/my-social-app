import React from "react";

const SharePost = async (postId) => {
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

export default SharePost;
