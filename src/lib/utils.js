import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Add test data
export const addTestData = async (name, email) => {
  try {
    const res = await API.post("/api/test/add", { name, email });
    return res.data;
  } catch (err) {
    console.error("Error adding test data:", err);
  }
};

// Get all test data
export const getAllTests = async () => {
  try {
    const res = await API.get("/api/test");
    return res.data;
  } catch (err) {
    console.error("Error fetching test data:", err);
  }
};
