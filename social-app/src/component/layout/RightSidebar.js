import SuggestedFriendList from "../SuggestedFriendList";

const RightSidebar = ({accessToken}) => (
    <aside className="rightSidebar">
      <h1>Right Sidebar</h1>
      <SuggestedFriendList accessToken={accessToken}/>
    </aside>
  );

  export default RightSidebar;