import FriendList from "../Friends/FriendList";
import FriendRequest from "../Friends/FriendRequest";
import SuggestedFriendList from "../Friends/SuggestedFriendList";

const RightSidebar = ({accessToken, loggedIn}) => {
  const userId = '65b74d5c578e10ea9c1ba474';
  return(
    <aside className="rightSidebar">
      {loggedIn && (
      <div>
        <FriendList accessToken={accessToken} />
        <SuggestedFriendList accessToken={accessToken} />
      </div>
    )}
      
    </aside>
  );
};
  export default RightSidebar;