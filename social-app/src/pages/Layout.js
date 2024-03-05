import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './layout.css'; // Import your CSS file for styling

const Layout = () => {
  return (
    <div className="container">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about-us" className="nav-link">About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/help" className="nav-link">Help</Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
