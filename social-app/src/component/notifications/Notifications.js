// Notifications.js
import React from 'react';
import './notifications.css';

const Notifications = () => {
  // Dummy notifications data
  const notifications = [
    {
      id: 1,
      message: 'You have a new friend request from John Doe.',
      time: '2 hours ago'
    },
    {
      id: 2,
      message: 'Your post received 10 likes.',
      time: '3 hours ago'
    },
    {
      id: 3,
      message: 'You have a new message from Jane Smith.',
      time: '5 hours ago'
    }
  ];

  return (
    <div className="notifications-container">
      <h2 className="notifications-header">Notifications</h2>
      <ul className="notifications-list">
        {notifications.map(notification => (
          <li key={notification.id} className="notification-item">
            <div className="notification-icon">
              <i className="fas fa-bell"></i>
            </div>
            <div className="notification-content">
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">{notification.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
