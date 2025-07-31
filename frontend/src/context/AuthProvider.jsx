import React, { createContext, useCallback, useContext, useState } from "react";
import useApi from "../api/useApi";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const api = useApi();
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const isAuthenticated = !!token;

  const saveAuthData = useCallback(({ accessToken, refreshToken, user }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
  }, []);

  const refreshAuthToken = useCallback(async () => {
    try {
      const response = await api.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      });

      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);
      return accessToken;
    } catch (error) {
      logout();
      throw error;
    }
  }, [api]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        isAuthenticated,
        saveAuthData,
        refreshAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
