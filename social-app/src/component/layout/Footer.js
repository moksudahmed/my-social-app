import UserProfile from "../UserProfile";

const AppFooter = ({accessToken}) => {
    const userId = '65b74d5c578e10ea9c1ba474';
    return(
    <footer className="footer">
      <h1>Footer</h1>
      <UserProfile userId = {userId} accessToken={accessToken} />
    </footer>
    )
  };

export default AppFooter;