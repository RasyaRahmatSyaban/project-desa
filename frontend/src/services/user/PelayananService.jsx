import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Buat axios instance dengan default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const PelayananServiceUser = {
  // Hanya method yang diizinkan untuk user
  getAllPelayanan: async () => {
    try {
      const response = await api.get("/pelayanan");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching pelayanan:", error);
      return [];
    }
  },
};

export default PelayananServiceUser;
