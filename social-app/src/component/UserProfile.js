import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId, accessToken }) => {
  const [userData, setUserData] = useState({});
  const [friendList, setFriendList] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  useEffect(() => {
    // Fetch user data, friend list, and suggested users when the component mounts
    fetchUserData();
    fetchFriendList();
    fetchSuggestedUsers();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchFriendList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/connections/get_friends', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriendList(data.friends || []); // Ensure friendList is an array
      } else {
        console.error('Failed to fetch friend list');
      }
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/connections/get_suggested_friends', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Test");
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setSuggestedUsers(data.suggestedUsers || []); // Ensure suggestedUsers is an array
      } else {
        console.error('Failed to fetch suggested users');
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/connections/send_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ friend_id: friendId }),
      });

      if (response.ok) {
        setFriendRequestSent(true);
      } else {
        console.error('Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div>
      <h1>{userData.name}</h1>
      <p>Friend List: {friendList.join(', ')}</p>

      {!friendRequestSent && (
        <div>
          <h2>Suggested Friends</h2>
          <ul>
            {suggestedUsers.map((user) => (
              <li key={user.id}>
                {user.name}
                <button onClick={() => sendFriendRequest(user.id)}>
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
