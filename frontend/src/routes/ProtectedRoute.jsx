import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated, refreshAuthToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    const checkAndRefreshToken = async () => {
      if (!token) {
        logout();
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const bufferTime = 300;

        if (decodedToken.exp < currentTime + bufferTime) {
          try {
            await refreshAuthToken();
          } catch (error) {
            console.error("Token refresh failed:", error);
            logout();
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        logout();
        navigate("/login");
      } 
    };

    // Initial check
    checkAndRefreshToken();

    // Set up periodic check (every 1 minute)
    intervalId = setInterval(checkAndRefreshToken, 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [token, refreshAuthToken, logout, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
