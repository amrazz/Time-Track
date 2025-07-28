import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { Navigate, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token, logout } = useAuth();
    const navigate = useNavigate()

    useEffect(() =>{
      if (token) {
        try{
          const decodedToken = jwtDecode(token)
          const currentTime = Date.now() / 1000

          if (decodedToken.exp < currentTime) {
            logout()
            navigate("/login")
          }
        } catch (error) {
          console.error("Invalid token:", error);
          logout();
          navigate('/login');
        }
      } 
    }, [logout, token ,navigate])

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
  return children
}

export default ProtectedRoute;