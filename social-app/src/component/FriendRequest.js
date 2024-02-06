import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequest = ({ userId, accessToken }) => {
  const [userData, setUserData] = useState({});
  const [friendList, setFriendList] = useState([]);
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
      console.log("Get Request Test")
      console.log(response.data);
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
        console.log(friendId);
      //setFriendRequestSent(true);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  useEffect(() => {
    // Fetch user data, friend list, and suggested users when the component mounts
    fetchUserData();
    getFriendRequest();
  }, []);

  return (
    <div>
      <h1>{userData.name}</h1>
      <p>Friend List: {friendList.join(', ')}</p>

      <div>
          <h2>Friend Request</h2>
          <ul>
            {pendingRequest.map((user) => (
              <li key={user.friend_id}>
                {user.name}
                <button onClick={() => acceptFriendRequest(user.friend_id)}>
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
