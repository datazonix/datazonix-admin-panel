import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ children }) => {
  const token = Cookies.get("token");

  // If logged in → redirect to dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
