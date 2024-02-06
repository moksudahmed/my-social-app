import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userId, accessToken }) => {
  const [userData, setUserData] = useState({});
  const [friendList, setFriendList] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);

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

  const fetchFriendList = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/connections/get_friends', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setFriendList(response.data.friends || []);
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/connections/get_suggested_friends', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });     
      
      setSuggestedUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const sendFriendRequest = async (friendId) => {
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
      setFriendRequestSent(true);
    } catch (error) {
      console.error('Error sending friend request:', error);
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

  useEffect(() => {
    // Fetch user data, friend list, and suggested users when the component mounts
    fetchUserData();
    fetchFriendList();
    fetchSuggestedUsers();
    getFriendRequest();
  }, []);

  return (
    <div>
      <h1>{userData.name}</h1>
      <p>Friend List: {friendList.join(', ')}</p>

      {!friendRequestSent && (
        <div>
          <h2>Suggested Friends</h2>
          <ul>
            {suggestedUsers.map((user) => (
              <li key={user._id}>
                {user.name}
                <button onClick={() => sendFriendRequest(user.friend_id)}>
                  Send Friend Request
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {friendRequestSent && <p>Friend request sent!</p>}
      
    </div>
  );
};

export default UserProfile;
