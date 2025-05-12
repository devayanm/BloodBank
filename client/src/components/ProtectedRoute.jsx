import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Replace this with your actual auth logic (token, context, etc)
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Redirect to login, preserving the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
