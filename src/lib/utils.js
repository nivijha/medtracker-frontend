import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling (auto logout if token invalid)
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

// ------- AUTH APIs -------
export const registerUser = async (name, email, password) => {
  const res = await API.post("/api/auth/register", { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post("/api/auth/login", { email, password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};


// ------- REPORT APIs -------

export const getReports = async () => {
  const res = await API.get("/api/reports/my");
  return res.data;
};

export const uploadReport = async (formData) => {
  try {
    const res = await API.post("/api/reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("UPLOAD ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteReport = async (reportId) => {
  const res = await API.delete(`/api/reports/${reportId}`);
  return res.data;
};


// ------- Medications APIs ------- 
export const getMedications = async () => {
  const res = await API.get("/api/medications");
  return res.data.medications || [];
};

export const createMedication = async (data) => {
  const res = await API.post("/api/medications", data);
  return res.data.medication;
};

export const deleteMedication = async (id) => {
  const res = await API.delete(`/api/medications/${id}`);
  return res.data;
};

export const getMedicationSchedule = async () => {
  const res = await API.get("/api/medications/schedule");
  return res.data || [];
};

export const markMedicationAsTaken = async (id) => {
  const res = await API.post(`/api/medications/${id}/take`);
  return res.data.medication;
};

export const processRefill = async (id) => {
  const res = await API.post(`/api/medications/${id}/refill`);
  return res.data.medication;
};


// ------- APPOINTMENT APIs -------
export const getAppointments = async () => {
  const res = await API.get("/api/appointments");
  return res.data.appointments || [];
};

export const getAppointment = async (id) => {
  const res = await API.get(`/api/appointments/${id}`);
  return res.data;
};

export const createAppointment = async (appointmentData) => {
  const res = await API.post("/api/appointments", appointmentData);
  return res.data.appointment || res.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const res = await API.put(`/api/appointments/${id}`, appointmentData);
  return res.data.appointment || res.data;
};

export const cancelAppointment = async (id) => {
  const res = await API.put(`/api/appointments/${id}/cancel`);
  return res.data.appointment || res.data;
};

export const deleteAppointment = async (id) => {
  const res = await API.delete(`/api/appointments/${id}`);
  return res.data;
};

export const getAvailableSlots = async (doctorId, date) => {
  const res = await API.get("/api/appointments/available-slots", {
    params: { doctorId, date }
  });
  return res.data.availableSlots || [];
};

export const rescheduleAppointment = async (id, newDateTime) => {
  const res = await API.put(`/api/appointments/${id}/reschedule`, { newDateTime });
  return res.data.appointment || res.data;
};


// ------- ACTIVITY APIs -------
export const getRecentActivity = async () => {
  const res = await API.get("/api/activity");
  return res.data || [];
};

export default API;
