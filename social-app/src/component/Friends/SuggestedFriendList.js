import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SuggestedFriendList.css'; // Import CSS for styling

const SuggestedFriendList = ({ accessToken }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/connections/get_suggested_friends', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [accessToken]);

  const sendFriendRequest = async (friendId) => {
    try {
      await axios.post('http://127.0.0.1:5000/connections/send_request', {
        friend_id: friendId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Remove the friend from the list when request is sent
      setFriends(prevFriends => prevFriends.filter(friend => friend.friend_id !== friendId));
    } catch (error) {
      console.error('Error during friend request:', error);
    }
  };

  return (
    <div className="suggested-friend-container">
      <h2 className="suggested-friend-heading">Friends Suggestions</h2>
      <ul className="friend-list">
        {friends.map((user) => (
          <li key={user.friend_id} className="friend-item">
            <span>{user.name}</span>
            <button className="send-request-button" onClick={() => sendFriendRequest(user.friend_id)}>
              Send Friend Request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedFriendList;
