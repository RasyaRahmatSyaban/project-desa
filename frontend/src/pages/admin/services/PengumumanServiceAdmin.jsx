import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common response issues
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error Response:", error.response || error);
    return Promise.reject(error);
  }
);

const PengumumanServiceAdmin = {
  // GET methods
  getAllPengumuman: async () => {
    try {
      const response = await api.get("/pengumuman");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching all pengumuman:", error);
      return [];
    }
  },

  getPengumumanById: async (id) => {
    try {
      const response = await api.get(`/pengumuman/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching pengumuman with id ${id}:`, error);
      return null;
    }
  },

  // POST method
  addPengumuman: async (pengumumanData) => {
    try {
      const response = await api.post("/pengumuman", pengumumanData);
      return response.data.data;
    } catch (error) {
      console.error("Error adding pengumuman:", error);
      throw error;
    }
  },

  // PUT method
  updatePengumuman: async (id, pengumumanData) => {
    try {
      const response = await api.put(`/pengumuman/${id}`, pengumumanData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating pengumuman with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE method
  deletePengumuman: async (id) => {
    try {
      const response = await api.delete(`/pengumuman/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting pengumuman with id ${id}:`, error);
      throw error;
    }
  },
};

export default PengumumanServiceAdmin;
