import { useState } from "react";
import { logoutUser } from "../api/auth";
import { toast } from "react-toastify";

export function useAuth() {
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

  return { isAuthenticated, login, logout };
}

