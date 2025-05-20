import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import Sidebar from "./Sidebar.jsx";
import Login from "../../pages/login/Login.jsx";
import Signup from "../../pages/login/Signup.jsx";
import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

const Layout = () => {
  const isAuthenticated = useSelector(state => state.authentication.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
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