import FriendList from "../FriendList";

const LeftSidebar = ({accessToken}) => (
    <aside className="leftSidebar">
      <h1>Left Sidebar</h1>
      <FriendList accessToken={accessToken} />
    </aside>
  );
  
export default LeftSidebar;