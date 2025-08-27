import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const secureApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Add request interceptor to include auth token
secureApi.interceptors.request.use(
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
secureApi.interceptors.response.use(
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

// Fungsi untuk memeriksa struktur data yang diharapkan server
const validateAparatData = (data) => {
  // Daftar field yang wajib ada
  const requiredFields = ["nama", "jabatan"];

  // Periksa apakah semua field wajib ada
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Field berikut wajib diisi: ${missingFields.join(", ")}`);
  }

  return true;
};

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

const AparatServiceAdmin = {
  // GET methods
  getAllAparat: async () => {
    try {
      const response = await secureApi.get("/aparatur");

      // Cek struktur response
      let dataArray = [];

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        dataArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (response.data && response.data.data) {
        dataArray = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
      } else {
        console.error("Unexpected response structure:", response.data);
        return [];
      }

      return dataArray;
    } catch (error) {
      console.error("Error fetching all aparat:", error);
      return [];
    }
  },

  getAparatById: async (id) => {
    try {
      const response = await secureApi.get(`/aparatur/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching aparat with id ${id}:`, error);
      return null;
    }
  },

  // POST method
  addAparat: async (aparatData) => {
    try {
      // Validasi data sebelum dikirim
      validateAparatData(aparatData);

      // Jika ada file foto, gunakan FormData
      if (aparatData.foto instanceof File) {
        const formData = new FormData();
        formData.append("nama", aparatData.nama);
        formData.append("jabatan", aparatData.jabatan);
        formData.append("nip", aparatData.nip);

        if(aparatData.nip){
          formData.append("nip", aparatData.nip.trim());
        }

        formData.append("foto", aparatData.foto);

        const response = await axios.post(`${API_URL}/aparatur`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
      } else {
        // Jika tidak ada file foto
        const response = await secureApi.post("/aparatur", aparatData);
        return response.data;
      }
    } catch (error) {
      console.error("Error adding aparat:", error);
      throw error;
    }
  },

  // PUT method
  updateAparat: async (id, aparatData) => {
    try {
      // Validasi data sebelum dikirim
      validateAparatData(aparatData);

      // Jika ada file foto, gunakan FormData
      if (aparatData.foto instanceof File) {
        const formData = new FormData();
        formData.append("nama", aparatData.nama);
        formData.append("jabatan", aparatData.jabatan);
        formData.append("nip", aparatData.nip);

        if (aparatData.telepon) {
          formData.append("telepon", aparatData.telepon);
        }

        formData.append("foto", aparatData.foto);

        const response = await axios.put(
          `${API_URL}/aparatur/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return response.data;
      } else {
        // Jika tidak ada file foto baru
        const response = await secureApi.put(`/aparatur/${id}`, aparatData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating aparat with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE method
  deleteAparat: async (id) => {
    try {
      // Get aparat data first to get the foto path
      const aparat = await AparatServiceAdmin.getAparatById(id);

      if (aparat && aparat.foto) {
        // Extract filename from path if needed
        const filename = extractFilename(aparat.foto);

        // Delete the aparat record
        const response = await secureApi.delete(`/aparatur/${id}`);

        // Request to delete the associated file (optional, karena server mungkin menangani ini)
        try {
          await secureApi.delete(`/aparatur/delete-file/${filename}`);
          console.log(`File ${filename} deleted successfully`);
        } catch (fileError) {
          console.error(`Error deleting file ${filename}:`, fileError);
          // Continue even if file deletion fails
        }

        return response.data;
      } else {
        // If no foto, just delete the aparat record
        const response = await secureApi.delete(`/aparatur/${id}`);
        return response.data;
      }
    } catch (error) {
      console.error(`Error deleting aparat with id ${id}:`, error);
      throw error;
    }
  },
  // Get image URL
  getImageUrl: (imagePath) => {

    console.log(imagePath)
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
      foto: item.foto ? AparatServiceAdmin.getImageUrl(item.foto) : "",
      telepon: item.telepon || "",
    }));
  },
};

export default AparatServiceAdmin;
