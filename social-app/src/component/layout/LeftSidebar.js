import FriendList from "../FriendList";
import PendingList from "../PendingList";

const LeftSidebar = ({accessToken}) => (
    <aside className="leftSidebar">
      <h1>Left Sidebar</h1>
      <FriendList accessToken={accessToken} />
      <h2>Pending Friend List</h2>
      <PendingList accessToken={accessToken}/>
    </aside>
  );
  
export default LeftSidebar;