import axios from "axios";

const API_URL = "http://localhost:3000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token for admin endpoints
api.interceptors.request.use(
  (config) => {
    // Only add token for admin endpoints
    if (config.url.includes("/penduduk") && !config.url.includes("/stats")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const PendudukService = {
  // Admin endpoints (requires authentication)
  getAllPenduduk: async () => {
    try {
      const response = await api.get("/penduduk");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching penduduk data:", error);
      throw error;
    }
  },

  getPendudukByNik: async (nik) => {
    try {
      const response = await api.get(`/penduduk/nik/${nik}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching penduduk with NIK ${nik}:`, error);
      throw error;
    }
  },

  addPenduduk: async (pendudukData) => {
    try {
      const response = await api.post("/penduduk", pendudukData);
      return response.data;
    } catch (error) {
      console.error("Error adding penduduk:", error);
      throw error;
    }
  },

  updatePenduduk: async (oldNik, pendudukData) => {
    try {
      const updateData = {
        oldNik,
        newNik: pendudukData.nik,
        nama: pendudukData.nama,
        alamat: pendudukData.alamat,
        tanggalLahir: pendudukData.tanggalLahir,
        jenisKelamin: pendudukData.jenisKelamin,
        agama: pendudukData.agama,
        kepalaKeluarga: pendudukData.kepalaKeluarga,
      };
      const response = await api.put("/penduduk/update", updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating penduduk:`, error);
      throw error;
    }
  },

  deletePenduduk: async (nik) => {
    try {
      const response = await api.delete(`/penduduk/delete/${nik}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting penduduk with NIK ${nik}:`, error);
      throw error;
    }
  },

  // Public endpoints (no authentication required)
  getTotalPenduduk: async () => {
    try {
      const response = await api.get("/penduduk/stats/total");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching total penduduk:", error);
      return 0;
    }
  },

  getTotalKepalaKeluarga: async () => {
    try {
      const response = await api.get("/penduduk/stats/kepala-keluarga");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching total kepala keluarga:", error);
      return 0;
    }
  },

  getTotalLakiLaki: async () => {
    try {
      const response = await api.get("/penduduk/stats/laki-laki");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching total laki-laki:", error);
      return 0;
    }
  },

  getTotalPerempuan: async () => {
    try {
      const response = await api.get("/penduduk/stats/perempuan");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching total perempuan:", error);
      return 0;
    }
  },

  getPendudukByAgama: async () => {
    try {
      const response = await api.get("/penduduk/stats/agama");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching penduduk by agama:", error);
      return [];
    }
  },

  getPendudukByUmur: async () => {
    try {
      const response = await api.get("/penduduk/stats/umur");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching penduduk by umur:", error);
      return [];
    }
  },

  // Helper functions
  getStatsSummary: async () => {
    try {
      const [total, kepalaKeluarga, lakiLaki, perempuan] = await Promise.all([
        PendudukService.getTotalPenduduk(),
        PendudukService.getTotalKepalaKeluarga(),
        PendudukService.getTotalLakiLaki(),
        PendudukService.getTotalPerempuan(),
      ]);

      return {
        totalPenduduk: total,
        totalKepalaKeluarga: kepalaKeluarga,
        totalLakiLaki: lakiLaki,
        totalPerempuan: perempuan,
      };
    } catch (error) {
      console.error("Error fetching stats summary:", error);
      return {
        totalPenduduk: 0,
        totalKepalaKeluarga: 0,
        totalLakiLaki: 0,
        totalPerempuan: 0,
      };
    }
  },

  getAllStats: async () => {
    try {
      const [summary, byAgama, byUmur] = await Promise.all([
        PendudukService.getStatsSummary(),
        PendudukService.getPendudukByAgama(),
        PendudukService.getPendudukByUmur(),
      ]);

      return {
        summary,
        byAgama,
        byUmur,
      };
    } catch (error) {
      console.error("Error fetching all stats:", error);
      throw error;
    }
  },
};

export default PendudukService;
