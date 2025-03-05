import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const login = (token) => {
    localStorage.setItem("jwtToken", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("googleAccessToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
