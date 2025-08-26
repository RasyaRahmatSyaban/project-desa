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

// Add response interceptor to handle common response issues
api.interceptors.response.use(
  (response) => {
    // Handle the case where the API returns data in a nested 'data' property
    if (response.data && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    console.error("API Error Response:", error.response || error);

    // If error is 404, return empty array instead of error
    if (error.response && error.response.status === 404) {
      console.warn("Resource not found (404), returning empty array");
      return Promise.resolve({ data: [] });
    }

    return Promise.reject(error);
  }
);

// Fungsi untuk mengekstrak nama file dari path
const extractFilename = (path) => {
  if (!path) return null;

  // Jika path berisi 'uploads/berita/', ekstrak hanya nama filenya
  if (path.includes("uploads/")) {
    return path.split("/").pop();
  }

  // Jika tidak, kembalikan path asli
  return path;
};

const BeritaService = {
  // GET methods
  getAllBerita: async () => {
    try {
      const response = await api.get("/berita");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all berita:", error);
      return [];
    }
  },

  // Get berita by status
  getBeritaByStatus: async (status) => {
    try {
      const response = await api.get(`/berita/status/${status}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Error fetching berita with status ${status}:`, error);
      return [];
    }
  },

  // Get published berita only (for user-facing pages)
  getPublishedBerita: async () => {
    try {
      const response = await api.get("/berita/status/Dipublikasi");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching published berita:", error);
      return [];
    }
  },

  // Get paginated berita - with status filtering
  getPaginatedBerita: async (page = 1, limit = 8, status = null) => {
    try {
      let allBerita;

      if (status) {
        // Jika status ditentukan, ambil berita dengan status tersebut
        allBerita = await BeritaService.getBeritaByStatus(status);
      } else {
        // Jika tidak, ambil semua berita yang dipublikasikan
        allBerita = await BeritaService.getPublishedBerita();
      }

      // Sort by date (newest first)
      const sortedBerita = allBerita.sort(
        (a, b) => new Date(b.tanggalTerbit) - new Date(a.tanggalTerbit)
      );

      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // Get items for current page
      const paginatedBerita = sortedBerita.slice(startIndex, endIndex);

      return {
        berita: paginatedBerita,
        totalItems: allBerita.length,
        totalPages: Math.ceil(allBerita.length / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching paginated berita:", error);
      return {
        berita: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
      };
    }
  },

  getBeritaById: async (id) => {
    try {
      const response = await api.get(`/berita/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching berita with id ${id}:`, error);
      return null;
    }
  },

  // Get latest berita (for featured slider) - only published
  getLatestBerita: async (limit = 3) => {
    try {
      const publishedBerita = await BeritaService.getPublishedBerita();

      // Sort by date (newest first) and take the specified limit
      return publishedBerita
        .sort((a, b) => new Date(b.tanggalTerbit) - new Date(a.tanggalTerbit))
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching latest berita:", error);
      return [];
    }
  },

  // Format date to a readable format
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

  // Get excerpt from content
  getExcerpt: (content, maxLength = 100) => {
    if (!content) return "";

    if (content.length <= maxLength) return content;

    return content.substring(0, maxLength) + "...";
  },

  // Get image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;

    // Jika path sudah lengkap (eksternal), gunakan apa adanya
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Ekstrak nama file jika path berisi 'uploads/berita/'
    const filename = extractFilename(imagePath);

    // Construct the URL to the image
    return `${API_URL}/storage/${filename}`;
  },
};

export default BeritaService;
