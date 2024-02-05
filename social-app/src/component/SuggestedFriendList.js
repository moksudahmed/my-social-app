import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        console.log(response);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [accessToken]);

  return (
    <div>
      <h2>Friends Suggestions</h2>
      <ul>
        {friends.map((friend, index) => (
          <li key={index}>{friend}</li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedFriendList;
