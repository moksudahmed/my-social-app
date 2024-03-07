import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PendingList.css'; // Import CSS for styling

const PendingList = ({ accessToken }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/connections/get_friend_request', {
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

  const acceptFriendRequest = async (friendId) => {
    try {
      await axios.post('http://127.0.0.1:5000/connections/accept_request', {
        friend_id: friendId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Remove the friend from the list when request is accepted
      setFriends(prevFriends => prevFriends.filter(friend => friend.friend_id !== friendId));
    } catch (error) {
      console.error('Error during friend request acceptance:', error);
    }
  };

  return (
    <div className="pending-list-container">
      <h2 className="pending-list-heading">Friends Pending</h2>
      <ul className="friend-list">
        {friends.map((user) => (
          <li key={user.friend_id} className="friend-item">
            <span>{user.name}</span>
            <button className="accept-request-button" onClick={() => acceptFriendRequest(user.friend_id)}>
              Accept Request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingList;
