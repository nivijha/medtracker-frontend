import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// ✅ Attach token automatically
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global error handling (auto logout if token invalid)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "token=; path=/; max-age=0;";
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ✅ Auth APIs
export const registerUser = async (name, email, password) => {
  const res = await API.post("/api/auth/register", { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post("/api/auth/login", { email, password });
  return res.data;
};

// ✅ Reports APIs
export const getReports = async () => {
  const res = await API.get("/api/reports");
  return res.data;
};

export const addReport = async (name, result) => {
  const res = await API.post("/api/reports/add", { name, result });
  return res.data;
};

export default API;
