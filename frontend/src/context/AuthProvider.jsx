import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const isAuthenticated = !!token;

  const saveToken = (token) => {
    localStorage.setItem("accessToken", token);
    setToken(token);
  };

  const saveUser = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ token, saveToken, logout, isAuthenticated, user, saveUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
