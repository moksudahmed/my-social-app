import React from 'react';
import PendingList from '../PendingList';

const LeftSidebar = ({ accessToken, loggedIn }) => (
  <aside className="leftSidebar">
    {loggedIn && (
      <div>
        <PendingList accessToken={accessToken} />
      </div>
    )}
  </aside>
);

export default LeftSidebar;
