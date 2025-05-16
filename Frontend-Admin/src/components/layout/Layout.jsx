import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import Sidebar from "./Sidebar.jsx";
import Login from "../../pages/login/Login.jsx";
import Signup from "../../pages/login/Signup.jsx";
import React from "react";
import { useSelector } from 'react-redux';
import { Routes, Route } from "react-router-dom";

const Layout = () => {
  const isAuthenticated = useSelector(state => state.authentication.isAuthenticated);

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <>
          <Sidebar />
          <div className="admin_body">
            <Main />
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Layout;