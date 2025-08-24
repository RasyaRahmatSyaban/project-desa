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

const PengumumanService = {
  // Get all active announcements
  getActivePengumuman: async () => {
    try {
      const response = await api.get("/pengumuman");
      // Filter only active announcements (where current date is between start and end date)
      const currentDate = new Date();
      return (response.data.data || []).filter((item) => {
        const startDate = new Date(item.tanggalMulai);
        const endDate = new Date(item.tanggalSelesai);
        return currentDate >= startDate && currentDate <= endDate;
      });
    } catch (error) {
      console.error("Error fetching active pengumuman:", error);
      return [];
    }
  },

  // Get a specific announcement by ID
  getPengumumanById: async (id) => {
    try {
      const response = await api.get(`/pengumuman/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching pengumuman with id ${id}:`, error);
      return null;
    }
  },
};

export default PengumumanService;
