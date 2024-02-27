import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Friends.css';

const Friends = ({ accessToken, loggedIn, username, logout }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/connections/get_friend_list', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [accessToken]);

  const unfriend = async (friendId) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/connections/unfriend', {
        friend_id: friendId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        // Remove the unfriended friend from the state
        setFriends(prevFriends => prevFriends.filter(friend => friend.friend_id !== friendId));
      } else {
        console.error('Failed to unfriend');
      }
    } catch (error) {
      console.error('Error during unfriending:', error);
    }
  };

  return (
    <div className="friends-container">
      <h2>Your Friends</h2>
      <ul className="friends-list">
        {friends.map((friend, index) => (
          <li key={index} className="friends-item">
            <span className="friend-name">{friend.name}</span>
            <button className="unfriend-button" onClick={() => unfriend(friend.friend_id)}>
              Unfriend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
