import React, { useState, type ReactNode } from "react";
import { logoutUser } from "../features/auth/api/auth";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
