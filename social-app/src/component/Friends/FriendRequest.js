import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendRequest.css'; // Import CSS for styling

const FriendRequest = ({ userId, accessToken }) => {
  const [userData, setUserData] = useState({});
  const [pendingRequest, setPendingRequest] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getFriendRequest = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/connections/get_friend_request', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPendingRequest(response.data || []);
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {      
      await axios.post(
        'http://127.0.0.1:5000/connections/send_request',
        { friend_id: friendId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  useEffect(() => {
    // Fetch user data and pending friend requests when the component mounts
    fetchUserData();
    getFriendRequest();
  }, []);

  return (
    <div className="friend-request-container">
      <h1 className="user-name">{userData.name}</h1>

      <div className="friend-request-section">
        <h2 className="friend-request-heading">Friend Requests</h2>
        <ul className="friend-request-list">
          {pendingRequest.map((user) => (
            <li key={user.friend_id} className="friend-request-item">
              <span className="friend-name">{user.name}</span>
              <button className="accept-request-button" onClick={() => acceptFriendRequest(user.friend_id)}>
                Accept Request
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendRequest;
