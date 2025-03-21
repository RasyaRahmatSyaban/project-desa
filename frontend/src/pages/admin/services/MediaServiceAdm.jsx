import axios from "axios";

const API_URL = "http://localhost:3000";

// Buat axios instance dengan default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor untuk include auth token
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

const MediaService = {
  // GET methods - Dapat diakses oleh admin dan user
  getAllMedia: async () => {
    try {
      const response = await api.get("/media");
      // Tambahkan created_at jika tidak ada (workaround)
      const data = response.data.data || [];
      return data.map((item) => {
        // Jika tidak ada created_at, coba ekstrak dari nama file (jika menggunakan timestamp)
        if (!item.created_at && item.file) {
          const filenameParts = item.file.split(".");
          const possibleTimestamp = Number.parseInt(filenameParts[0]);
          if (!isNaN(possibleTimestamp)) {
            item.created_at = new Date(possibleTimestamp).toISOString();
          } else {
            // Fallback: gunakan tanggal hari ini
            item.created_at = new Date().toISOString();
          }
        }
        return item;
      });
    } catch (error) {
      console.error("Error fetching media:", error);
      return [];
    }
  },

  getMediaById: async (id) => {
    try {
      const response = await api.get(`/media/${id}`);
      const item = response.data.data;
      // Tambahkan created_at jika tidak ada (workaround)
      if (!item.created_at && item.file) {
        const filenameParts = item.file.split(".");
        const possibleTimestamp = Number.parseInt(filenameParts[0]);
        if (!isNaN(possibleTimestamp)) {
          item.created_at = new Date(possibleTimestamp).toISOString();
        } else {
          // Fallback: gunakan tanggal hari ini
          item.created_at = new Date().toISOString();
        }
      }
      return item;
    } catch (error) {
      console.error(`Error fetching media with id ${id}:`, error);
      return null;
    }
  },

  // POST method - Hanya dapat diakses oleh admin
  addMedia: async (mediaData) => {
    try {
      // Jika ada file, gunakan FormData
      if (mediaData instanceof FormData) {
        const response = await axios.post(`${API_URL}/media`, mediaData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
      } else {
        // Jika tidak ada file
        const response = await api.post("/media", mediaData);
        return response.data;
      }
    } catch (error) {
      console.error("Error adding media:", error);
      throw error;
    }
  },

  // PUT method - Hanya dapat diakses oleh admin
  updateMedia: async (id, mediaData) => {
    try {
      // Jika ada file, gunakan FormData
      if (mediaData instanceof FormData) {
        const response = await axios.put(`${API_URL}/media/${id}`, mediaData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
      } else {
        // Jika tidak ada file
        const response = await api.put(`/media/${id}`, mediaData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating media with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE method - Hanya dapat diakses oleh admin
  deleteMedia: async (id) => {
    try {
      const response = await api.delete(`/media/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting media with id ${id}:`, error);
      throw error;
    }
  },

  // Get media URL - Dapat diakses oleh admin dan user
  getMediaUrl: (filename) => {
    if (!filename) return null;

    // If path already starts with http:// or https://, return as is
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename;
    }

    // Ekstrak nama file dari path jika ada
    const filenameOnly = filename.split("/").pop();

    // Return the complete URL - tanpa parameter tambahan yang bisa menyebabkan masalah
    return `${API_URL}/berita/${filenameOnly}`;
  },

  // Format date - Dapat diakses oleh admin dan user
  formatDate: (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", dateString, err);
      return dateString;
    }
  },

  // Ekstrak tahun dari tanggal - Fungsi baru untuk membantu filter tahun
  extractYear: (item) => {
    if (item.created_at) {
      const date = new Date(item.created_at);
      if (!isNaN(date.getTime())) {
        return date.getFullYear().toString();
      }

      // Jika format tanggal tidak valid, coba ekstrak substring
      if (typeof item.created_at === "string" && item.created_at.length >= 4) {
        return item.created_at.substring(0, 4);
      }
    }

    // Fallback: coba ekstrak dari nama file
    if (item.file) {
      const filenameParts = item.file.split(".");
      const possibleTimestamp = Number.parseInt(filenameParts[0]);
      if (!isNaN(possibleTimestamp)) {
        return new Date(possibleTimestamp).getFullYear().toString();
      }
    }

    // Jika semua cara gagal, gunakan tahun saat ini
    return new Date().getFullYear().toString();
  },

  // Deteksi tipe file berdasarkan ekstensi
  getFileType: (filename) => {
    if (!filename) return null;

    const extension = filename.split(".").pop().toLowerCase();

    // Grup ekstensi berdasarkan tipe
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoExtensions = ["mp4", "webm", "ogg", "mkv"];
    const pdfExtensions = ["pdf"];

    if (imageExtensions.includes(extension)) return "image";
    if (videoExtensions.includes(extension)) return "video";
    if (pdfExtensions.includes(extension)) return "pdf";

    return "unknown";
  },
};

export default MediaService;
