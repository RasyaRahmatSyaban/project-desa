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

  // Jika path berisi 'uploads/', ekstrak hanya nama filenya
  if (path.includes("uploads/")) {
    return path.split("/").pop();
  }

  // Jika tidak, kembalikan path asli
  return path;
};

const AparatServiceUser = {
  // GET methods
  getAllAparat: async () => {
    try {
      const response = await api.get("/aparatur");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all aparat:", error);
      return [];
    }
  },

  getAparatById: async (id) => {
    try {
      const response = await api.get(`/aparatur/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching aparat with id ${id}:`, error);
      return null;
    }
  },

  // Get image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;

    // Jika path sudah lengkap (eksternal), gunakan apa adanya
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Ekstrak nama file jika path berisi 'uploads/'
    const filename = extractFilename(imagePath);

    // Construct the URL to the image
    return `${API_URL}/uploads/${filename}`;
  },

  // Format data dari API ke format yang digunakan component
  formatAparatData: (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      id: item.id,
      nama: item.nama || "",
      jabatan: item.jabatan || "",
      nip: item.nip || item.nik || "",
      foto: item.foto ? AparatServiceUser.getImageUrl(item.foto) : "",
      telepon: item.telepon || "",
    }));
  },
};

export default AparatServiceUser;
