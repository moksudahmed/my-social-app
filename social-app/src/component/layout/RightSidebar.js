import FriendList from "../FriendList";
import FriendRequest from "../FriendRequest";
import SuggestedFriendList from "../SuggestedFriendList";

const RightSidebar = ({accessToken}) => {
  const userId = '65b74d5c578e10ea9c1ba474';
  return(
    <aside className="rightSidebar">
      <h1>Right Sidebar</h1>
      <FriendList accessToken={accessToken} />
      <SuggestedFriendList accessToken={accessToken} />
    </aside>
  );
};
  export default RightSidebar;