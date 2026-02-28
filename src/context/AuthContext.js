"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import API from "@/lib/utils";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await API.post("/api/auth/login", { email, password });
    const { user, token } = res.data;
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    // Set a cookie for the middleware to read
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    
    setUser(user);
    setToken(token);
    router.push("/dashboard");
    return res.data;
  }, [router]);

  const register = useCallback(async (name, email, phone, password) => {
    const res = await API.post("/api/auth/register", { name, email, phone, password });
    const { user, token } = res.data;
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    
    setUser(user);
    setToken(token);
    router.push("/dashboard");
    return res.data;
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0;";
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((newUser) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  // Sync token with API instance
  useEffect(() => {
    if (token) {
      API.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.Authorization;
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
