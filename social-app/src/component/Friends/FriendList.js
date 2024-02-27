import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendList = ({ accessToken }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/connections/get_friend_list', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data.friends);
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
    <div>
      <h2>Your Friends</h2>
      <ul>
        {friends.map((friend, index) => (
          <li key={index}>
            {friend.name}
            <button onClick={() => unfriend(friend.friend_id)}>
              Unfriend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
