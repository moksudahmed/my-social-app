import React from 'react';
import PendingList from '../PendingList';

const LeftSidebar = ({ accessToken, loggedIn }) => (
  <aside className="leftSidebar">
    <h1>Left Sidebar</h1>
    {loggedIn && (
      <div>
        <h2>Pending Friend List</h2>
        <PendingList accessToken={accessToken} />
      </div>
    )}
  </aside>
);

export default LeftSidebar;
