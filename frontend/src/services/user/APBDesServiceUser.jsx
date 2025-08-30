import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config (no auth for GETs)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const APBDesServiceUser = {
  // Read-only endpoints
  getAllDanaMasuk: async () => {
    try {
      const response = await api.get("/dana/apbdes/dana-masuk");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching dana masuk:", error);
      throw error;
    }
  },

  getAllDanaKeluar: async () => {
    try {
      const response = await api.get("/dana/apbdes/dana-keluar");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching dana keluar:", error);
      throw error;
    }
  },

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

  // Helpers
  getAvailableYears: async () => {
    try {
      const [danaMasuk, danaKeluar] = await Promise.all([
        APBDesService.getAllDanaMasuk(),
        APBDesService.getAllDanaKeluar(),
      ]);
      const years = new Set();
      danaMasuk.forEach((item) => years.add(item.tahun));
      danaKeluar.forEach((item) => years.add(item.tahun));
      return Array.from(years).sort((a, b) => b - a);
    } catch (error) {
      console.error("Error fetching available years:", error);
      return [];
    }
  },

  formatCurrency: (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  },

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

export default APBDesServiceUser;
