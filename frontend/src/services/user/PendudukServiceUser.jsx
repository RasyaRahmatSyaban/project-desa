import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const PendudukServiceUser = {
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
        PendudukServiceUser.getTotalPenduduk(),
        PendudukServiceUser.getTotalKepalaKeluarga(),
        PendudukServiceUser.getTotalLakiLaki(),
        PendudukServiceUser.getTotalPerempuan(),
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
        PendudukServiceUser.getStatsSummary(),
        PendudukServiceUser.getPendudukByAgama(),
        PendudukServiceUser.getPendudukByUmur(),
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

export default PendudukServiceUser;
