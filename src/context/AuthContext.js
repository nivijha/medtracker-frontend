"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import API from "@/lib/utils";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      const res = await API.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    const res = await API.post("/api/auth/login", { email, password });
    const { user, token } = res.data;
    setUser(user);
    
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    
    window.location.href = "/dashboard";
    return res.data;
  }, []);

  const register = useCallback(async (name, email, phone, password) => {
    const res = await API.post("/api/auth/register", { name, email, phone, password });
    const { user, token } = res.data;
    setUser(user);
    
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    
    window.location.href = "/dashboard";
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout API call failed", err);
    } finally {
      setUser(null);
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
    }
  }, []);

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
