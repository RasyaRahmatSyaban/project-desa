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

// Add request interceptor to include auth token for admin endpoints
api.interceptors.request.use(
  (config) => {
    // Only add token for admin endpoints (POST, PUT, DELETE)
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "delete"
    ) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const APBDesService = {
  // Dana Masuk (Income) endpoints
  getAllDanaMasuk: async () => {
    try {
      const response = await api.get("/dana/apbdes/dana-masuk");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching dana masuk:", error);
      throw error;
    }
  },

  getDanaMasukById: async (id) => {
    try {
      const response = await api.get(`/dana/apbdes/dana-masuk/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching dana masuk with id ${id}:`, error);
      throw error;
    }
  },

  addDanaMasuk: async (danaMasukData) => {
    try {
      const response = await api.post("/dana/apbdes/dana-masuk", danaMasukData);
      return response.data;
    } catch (error) {
      console.error("Error adding dana masuk:", error);
      throw error;
    }
  },

  updateDanaMasuk: async (id, danaMasukData) => {
    try {
      const response = await api.put(
        `/dana/apbdes/dana-masuk/${id}`,
        danaMasukData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating dana masuk with id ${id}:`, error);
      throw error;
    }
  },

  deleteDanaMasuk: async (id) => {
    try {
      const response = await api.delete(`/dana/apbdes/dana-masuk/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting dana masuk with id ${id}:`, error);
      throw error;
    }
  },

  // Dana Keluar (Expense) endpoints
  getAllDanaKeluar: async () => {
    try {
      const response = await api.get("/dana/apbdes/dana-keluar");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching dana keluar:", error);
      throw error;
    }
  },

  getDanaKeluarById: async (id) => {
    try {
      const response = await api.get(`/dana/apbdes/dana-keluar/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching dana keluar with id ${id}:`, error);
      throw error;
    }
  },

  addDanaKeluar: async (danaKeluarData) => {
    try {
      const response = await api.post(
        "/dana/apbdes/dana-keluar",
        danaKeluarData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding dana keluar:", error);
      throw error;
    }
  },

  updateDanaKeluar: async (id, danaKeluarData) => {
    try {
      const response = await api.put(
        `/dana/apbdes/dana-keluar/${id}`,
        danaKeluarData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating dana keluar with id ${id}:`, error);
      throw error;
    }
  },

  deleteDanaKeluar: async (id) => {
    try {
      const response = await api.delete(`/dana/apbdes/dana-keluar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting dana keluar with id ${id}:`, error);
      throw error;
    }
  },

  // Summary and Detail endpoints
  getAPBDesSummary: async (tahun) => {
    try {
      const response = await api.get(`/dana/apbdes/summary/${tahun}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching APBDes summary for year ${tahun}:`, error);
      return [];
    }
  },

  getAPBDesDetail: async (tahun) => {
    try {
      const response = await api.get(`/dana/apbdes/detail/${tahun}`);
      return response.data.data || { pendapatan: [], pengeluaran: [] };
    } catch (error) {
      console.error(`Error fetching APBDes detail for year ${tahun}:`, error);
      return { pendapatan: [], pengeluaran: [] };
    }
  },

  // Helper functions
  getAvailableYears: async () => {
    try {
      // Get all dana masuk and dana keluar to extract available years
      const [danaMasuk, danaKeluar] = await Promise.all([
        APBDesService.getAllDanaMasuk(),
        APBDesService.getAllDanaKeluar(),
      ]);

      // Extract unique years
      const years = new Set();
      danaMasuk.forEach((item) => years.add(item.tahun));
      danaKeluar.forEach((item) => years.add(item.tahun));

      // Convert to array and sort in descending order
      return Array.from(years).sort((a, b) => b - a);
    } catch (error) {
      console.error("Error fetching available years:", error);
      return [];
    }
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Get month name
  getMonthName: (monthNumber) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[monthNumber - 1] || "";
  },
};

export default APBDesService;
