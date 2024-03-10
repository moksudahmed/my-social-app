import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './UserProfile.css'; // Import CSS for styling
import image from '../images/placeholder.jpg';
import Feed from '../component/Feed';

const UserProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [friendList, setFriendList] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [profilePicture, setProfilePicture] = useState(image); // State for profile picture
  const location = useLocation();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/user/get_username`, {
        headers: {
          Authorization: `Bearer ${location.state.accessToken}`,
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
          Authorization: `Bearer ${location.state.accessToken}`,
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
          Authorization: `Bearer ${location.state.accessToken}`,
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
            Authorization: `Bearer ${location.state.accessToken}`,
          },
        }
      );
      setFriendRequestSent(true);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const getFriendRequest = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/connections/get_friend_request', {
        headers: {
          Authorization: `Bearer ${location.state.accessToken}`,
        },
      });
      setPendingRequest(response.data || []);
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  // Function to handle profile picture change
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${location.state.accessToken}`,
        },
      });
      console.log('Profile picture uploaded successfully');
      // Update profile picture in UI
      setProfilePicture(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading profile picture:', error);
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
    <div className="profile-container">
       <div className="profile-header">
        <h1>{userData.name}</h1>
        <img src={profilePicture} alt="Profile" className="profile-image" />
        {/* Input for profile picture change */}
        <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
      </div>
      <div className="profile-content">
        <div className="friend-list">
          <h2>Friend List</h2>
          <p>{friendList.join(', ')}</p>
        </div>
        <div className="suggested-friends">
          {!friendRequestSent && (
            <>
              <h2>Suggested Friends</h2>
              <ul>
                {suggestedUsers.map((user) => (
                  <li key={user.id}>
                    {user.name}
                    <button onClick={() => sendFriendRequest(user.friend_id)}>Send Friend Request</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {friendRequestSent && <p className="friend-request-sent">Friend request sent!</p>}
        <div className="friend-request">
          <h2>Friend Requests</h2>
          <ul>
            {pendingRequest.map((user) => (
              <li key={user.friend_id}>
                {user.name}
                <button onClick={() => sendFriendRequest(user.friend_id)}>Accept Request</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="feed-section">
          <Feed accessToken={location.state.accessToken} loggedIn={location.state.loggedIn} type={'individual'} />
        </div>
      </div>
    </div>
  );

};

export default UserProfilePage;


