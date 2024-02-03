import React, { useState, useEffect } from 'react';

const User = ({ username }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get_user_by_username/${username}`);        
        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error during user data fetching:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [username]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>{userName}</p>
      )}
    </div>
  );
};

export default User;
