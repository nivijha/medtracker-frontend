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

export const getCurrentUser = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};

// ✅ Reports APIs
export const getReports = async () => {
  const res = await API.get("/api/upload/files");
  return res.data.files || [];
};

export const uploadReport = async (formData) => {
  const res = await API.post("/api/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.report || res.data;
};

export const downloadReport = async (reportId, fileId) => {
  const res = await API.get(`/api/upload/files/${reportId}/${fileId}/download`, {
    responseType: 'blob',
  });
  return res.data;
};

export const viewReport = async (reportId, fileId) => {
  const res = await API.get(`/api/upload/files/${reportId}/${fileId}/view`, {
    responseType: 'blob',
  });
  return res.data;
};

export const deleteReport = async (reportId, fileId) => {
  const res = await API.delete(`/api/upload/files/${reportId}/${fileId}`);
  return res.data;
};

// ✅ Medications APIs
export const getMedications = async () => {
  const res = await API.get("/api/medications");
  return res.data.medications || [];
};

export const getMedication = async (id) => {
  const res = await API.get(`/api/medications/${id}`);
  return res.data;
};

export const createMedication = async (medicationData) => {
  const res = await API.post("/api/medications", medicationData);
  return res.data.medication || res.data;
};

export const updateMedication = async (id, medicationData) => {
  const res = await API.put(`/api/medications/${id}`, medicationData);
  return res.data.medication || res.data;
};

export const deleteMedication = async (id) => {
  const res = await API.delete(`/api/medications/${id}`);
  return res.data;
};

export const getRefillSoonMedications = async () => {
  const res = await API.get("/api/medications/refill-soon");
  return res.data || [];
};

export const getMedicationSchedule = async () => {
  const res = await API.get("/api/medications/schedule");
  return res.data || [];
};

export const markMedicationAsTaken = async (id) => {
  const res = await API.post(`/api/medications/${id}/take`);
  return res.data.medication || res.data;
};


export const getMedicationAdherence = async () => {
  const res = await API.get("/api/medications/adherence");
  return res.data.adherence || res.data;
};

// ✅ Appointments APIs
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

export const getUpcomingAppointments = async () => {
  const res = await API.get("/api/appointments/upcoming");
  return res.data;
};

export const getPastAppointments = async () => {
  const res = await API.get("/api/appointments/past");
  return res.data.appointments || [];
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

// ✅ Prescriptions APIs
export const getPrescriptions = async () => {
  const res = await API.get("/api/prescriptions");
  return res.data.prescriptions || [];
};

export const getPrescription = async (id) => {
  const res = await API.get(`/api/prescriptions/${id}`);
  return res.data;
};

export const createPrescription = async (prescriptionData) => {
  const res = await API.post("/api/prescriptions", prescriptionData);
  return res.data.prescription || res.data;
};

export const updatePrescription = async (id, prescriptionData) => {
  const res = await API.put(`/api/prescriptions/${id}`, prescriptionData);
  return res.data.prescription || res.data;
};

export const deletePrescription = async (id) => {
  const res = await API.delete(`/api/prescriptions/${id}`);
  return res.data;
};

export const getActivePrescriptions = async () => {
  const res = await API.get("/api/prescriptions/active");
  return res.data || [];
};

export const getRefillNeededPrescriptions = async () => {
  const res = await API.get("/api/prescriptions/refill-needed");
  return res.data || [];
};

export const processRefill = async (id) => {
  const res = await API.post(`/api/prescriptions/${id}/refill`);
  return res.data.prescription || res.data;
};

export const transferPrescription = async (id, pharmacyData) => {
  const res = await API.post(`/api/prescriptions/${id}/transfer`, pharmacyData);
  return res.data.prescription || res.data;
};

// ✅ Health Metrics APIs
export const getHealthMetrics = async () => {
  const res = await API.get("/api/health-metrics");
  return res.data.metrics || [];
};

export const getHealthMetric = async (id) => {
  const res = await API.get(`/api/health-metrics/${id}`);
  return res.data;
};

export const createHealthMetric = async (metricData) => {
  const res = await API.post("/api/health-metrics", metricData);
  return res.data.metric || res.data;
};

export const updateHealthMetric = async (id, metricData) => {
  const res = await API.put(`/api/health-metrics/${id}`, metricData);
  return res.data.metric || res.data;
};

export const deleteHealthMetric = async (id) => {
  const res = await API.delete(`/api/health-metrics/${id}`);
  return res.data;
};

export const getHealthMetricsSummary = async () => {
  const res = await API.get("/api/health-metrics/summary");
  return res.data || {};
};

export const getHealthTrends = async (metricType, period) => {
  const res = await API.get("/api/health-metrics/trends", {
    params: { metricType, period }
  });
  return res.data || [];
};

export const getBMIHistory = async () => {
  const res = await API.get("/api/health-metrics/bmi");
  return res.data || [];
};

// ✅ Doctors APIs
export const getDoctors = async () => {
  const res = await API.get("/api/doctors");
  return res.data.doctors || [];
};

export const getDoctor = async (id) => {
  const res = await API.get(`/api/doctors/${id}`);
  return res.data;
};

export const getDoctorAvailability = async (id) => {
  const res = await API.get(`/api/doctors/${id}/availability`);
  return res.data.availableSlots || [];
};

export const addDoctorReview = async (id, reviewData) => {
  const res = await API.post(`/api/doctors/${id}/reviews`, reviewData);
  return res.data.rating || res.data;
};

export const getDoctorSpecialties = async () => {
  const res = await API.get("/api/doctors/specialties");
  return res.data || [];
};

export const getTopRatedDoctors = async () => {
  const res = await API.get("/api/doctors/top-rated");
  return res.data || [];
};

// ✅ User Profile APIs
export const getUserProfile = async () => {
  const res = await API.get("/api/profile");
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await API.put("/api/profile", profileData);
  return res.data.profile || res.data;
};

export const updateUserPreferences = async (preferences) => {
  const res = await API.put("/api/profile/preferences", preferences);
  return res.data.preferences || res.data;
};

export const updateUserSecurity = async (securityData) => {
  const res = await API.put("/api/profile/security", securityData);
  return res.data.security || res.data;
};

export const addProvider = async (providerData) => {
  const res = await API.post("/api/profile/providers", providerData);
  return res.data.provider || res.data;
};

export const removeProvider = async (providerId) => {
  const res = await API.delete(`/api/profile/providers/${providerId}`);
  return res.data;
};

export const getHealthSummary = async () => {
  const res = await API.get("/api/profile/health-summary");
  return res.data.summary || res.data;
};

export const deleteUserAccount = async () => {
  const res = await API.delete("/api/profile");
  return res.data;
};

// ✅ Notifications APIs
export const getNotifications = async () => {
  const res = await API.get("/api/notifications");
  return res.data.notifications || [];
};

export const getNotification = async (id) => {
  const res = await API.get(`/api/notifications/${id}`);
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await API.put(`/api/notifications/${id}/read`);
  return res.data.notification || res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await API.put("/api/notifications/read-all");
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await API.delete(`/api/notifications/${id}`);
  return res.data;
};

export const createMedicationReminders = async (reminderData) => {
  const res = await API.post("/api/notifications/medication-reminders", reminderData);
  return res.data.reminders || res.data;
};

export const createAppointmentReminders = async (reminderData) => {
  const res = await API.post("/api/notifications/appointment-reminders", reminderData);
  return res.data.reminders || res.data;
};

export const createRefillReminders = async (reminderData) => {
  const res = await API.post("/api/notifications/refill-reminders", reminderData);
  return res.data.reminders || res.data;
};

export const sendTestNotification = async () => {
  const res = await API.post("/api/notifications/test");
  return res.data.notification || res.data;
};

// ✅ Data Export APIs
export const exportUserData = async (exportData) => {
  const res = await API.post("/api/export", exportData, {
    responseType: 'blob',
  });
  return res.data || res;
};

export const getExportHistory = async () => {
  const res = await API.get("/api/export/history");
  return res.data.history || [];
};

// ✅ Data Visualization APIs
export const getHealthTrendsVisualization = async (period) => {
  const res = await API.get("/api/visualization/health-trends", {
    params: { period }
  });
  return res.data || {};
};

export const getMedicationAdherenceVisualization = async (period) => {
  const res = await API.get("/api/visualization/medication-adherence", {
    params: { period }
  });
  return res.data || {};
};

export const getAppointmentStatistics = async (period) => {
  const res = await API.get("/api/visualization/appointment-stats", {
    params: { period }
  });
  return res.data || {};
};

export const getDashboardSummary = async () => {
  const res = await API.get("/api/visualization/dashboard");
  return res.data || {};
};

// ✅ Medication Interactions APIs
export const checkMedicationInteractions = async (medications) => {
  const res = await API.post("/api/medication-interactions/check", { medications });
  return res.data.interactions || res.data;
};

export const checkPrescriptionInteractions = async (prescriptions) => {
  const res = await API.post("/api/medication-interactions/check-prescriptions", { prescriptions });
  return res.data.interactions || res.data;
};

export const checkMixedInteractions = async (data) => {
  const res = await API.post("/api/medication-interactions/check-mixed", data);
  return res.data.interactions || res.data;
};

export const getMedicationInteractions = async (medicationId) => {
  const res = await API.get(`/api/medication-interactions/${medicationId}`);
  return res.data || [];
};

export const addMedicationInteraction = async (medicationId, interactionData) => {
  const res = await API.post(`/api/medication-interactions/${medicationId}/interactions`, interactionData);
  return res.data.interaction || res.data;
};

export const removeMedicationInteraction = async (medicationId, interactionId) => {
  const res = await API.delete(`/api/medication-interactions/${medicationId}/interactions/${interactionId}`);
  return res.data;
};

export const getCommonInteractions = async () => {
  const res = await API.get("/api/medication-interactions/common");
  return res.data || [];
};

export default API;
