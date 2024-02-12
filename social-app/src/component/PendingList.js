import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingList = ({ accessToken }) => {
  const [friends, setFriends] = useState([]);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/connections/get_friend_request', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [accessToken]);
  const acceptFriendRequest = async (friendId) => {
    console.log(friendId);
    try {
      const response = await fetch(`http://127.0.0.1:5000/connections/accept_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
         // content_type: contentType,
         friend_id: friendId,
        }),
      });
      
      if (response.ok) {
       // console.log('Photo Post:', { content });
       console.log(friendId);
       setFriendRequestSent(true);
      } else {
        console.error('Failed to post photo');
      }
    } catch (error) {
      console.error('Error during photo post submission:', error);
    }
  };
  return (
    <div>
      <h2>Friends Pending</h2>
      <ul>
      {friends.map((user) => (
              <li key={user.id}>
                {user.name}
                <button onClick={() => acceptFriendRequest(user.friend_id)}>
                  Accept Request
                </button>
              </li>
            ))}
        
      </ul>
    </div>
  );
};

export default PendingList;
