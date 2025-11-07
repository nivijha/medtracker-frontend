import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// ✅ Automatically attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ AUTH APIs
export const registerUser = async (name, email, password) => {
  const res = await API.post("/api/auth/register", { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post("/api/auth/login", { email, password });
  return res.data;
};

export const getUserProfile = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};

// ✅ (Keep your test routes)
export const addTestData = async (name, email) => {
  const res = await API.post("/api/test/add", { name, email });
  return res.data;
};

export const getAllTests = async () => {
  const res = await API.get("/api/test");
  return res.data;
};

export default API;
