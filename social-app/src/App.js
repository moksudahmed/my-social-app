import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import HomePage from "./pages/HomePage"; // Import the HomePage component
import AboutPage from "./pages/AboutPage";
import Help from "./pages/Help";
import Login from "./component/auth/Login"; // Import the Login component
import './App.css';
import './module.css';
import UserProfilePage from "./pages/UserProfilePage";


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />          
          <Route path="about-us" element={<AboutPage />} />
          <Route path="user-profile" element={<UserProfilePage />} />          
          <Route path="help" element={<Help />} />
          <Route path="*" element={<NoPage />} />
        </Route>        
      </Routes>
    </BrowserRouter>
  );
}
