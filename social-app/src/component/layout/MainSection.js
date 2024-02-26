import React, { useState } from 'react';
import Feed from '../../component/Feed';
import Friends from '../../component/Friends';
import Notifications from '../../component/Notifications';
import Videos from '../../component/Videos';
import './MainSection.css';

const MainSection = ({ accessToken, loggedIn, username, logout }) => {
  const [activeTab, setActiveTab] = useState('feed');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed accessToken={accessToken} loggedIn={loggedIn} username={username} logout={logout} />;
      case 'friends':
        return <Friends accessToken={accessToken} loggedIn={loggedIn} username={username} />;
      case 'notifications':
        return <Notifications accessToken={accessToken} loggedIn={loggedIn} username={username} />;
      case 'videos':
        return <Videos accessToken={accessToken} loggedIn={loggedIn} username={username} />;
      default:
        return null;
    }
  };

  return (
    <main className="mainSection">
      <div className="tab-navigation">
        <button className={activeTab === 'feed' ? 'active' : ''} onClick={() => handleTabChange('feed')}>
          Feed
        </button>
        <button className={activeTab === 'friends' ? 'active' : ''} onClick={() => handleTabChange('friends')}>
          Friends
        </button>
        <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => handleTabChange('notifications')}>
          Notifications
        </button>
        <button className={activeTab === 'videos' ? 'active' : ''} onClick={() => handleTabChange('videos')}>
          Videos
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </main>
  );
};

export default MainSection;
