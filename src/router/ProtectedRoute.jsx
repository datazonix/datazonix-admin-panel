import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");

  // If no token → redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → allow access
  return children;
};

export default ProtectedRoute;
