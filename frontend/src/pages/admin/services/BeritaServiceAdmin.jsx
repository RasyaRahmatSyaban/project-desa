import axios from "axios";

const API_URL = "http://localhost:3000";

// Create axios instance with default config
const secureApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
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
const validateBeritaData = (data) => {
  // Daftar field yang wajib ada
  const requiredFields = ["judul", "isi"];

  // Periksa apakah semua field wajib ada
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Field berikut wajib diisi: ${missingFields.join(", ")}`);
  }

  // Periksa format tanggal jika ada
  if (data.tanggalTerbit) {
    // Jika tanggal sudah dalam format ISO string, konversi ke YYYY-MM-DD
    if (data.tanggalTerbit.includes("T")) {
      data.tanggalTerbit = data.tanggalTerbit.split("T")[0];
    }

    // Periksa format tanggal
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.tanggalTerbit)) {
      // Coba format ulang tanggal jika tidak sesuai format
      try {
        const date = new Date(data.tanggalTerbit);
        if (!isNaN(date.getTime())) {
          data.tanggalTerbit = date.toISOString().split("T")[0];
        } else {
          throw new Error("Format tanggal harus YYYY-MM-DD");
        }
      } catch (e) {
        throw new Error("Format tanggal harus YYYY-MM-DD");
      }
    }
  }

  return true;
};

// Fungsi untuk mengekstrak nama file dari path
const extractFilename = (path) => {
  if (!path) return null;

  // Jika path berisi 'uploads/berita/', ekstrak hanya nama filenya
  if (path.includes("uploads/storage/")) {
    return path.split("/").pop();
  }

  // Jika tidak, kembalikan path asli
  return path;
};

const BeritaServiceAdmin = {
  // GET methods
  getAllBerita: async () => {
    try {
      const response = await secureApi.get("/berita");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all berita:", error);
      return [];
    }
  },

  getBeritaByStatus: async (status) => {
    try {
      const response = await secureApi.get(`/berita/status/${status}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Error fetching berita with status ${status}:`, error);
      return [];
    }
  },

  getBeritaById: async (id) => {
    try {
      const response = await secureApi.get(`/berita/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching berita with id ${id}:`, error);
      return null;
    }
  },

  // POST method
  addBerita: async (beritaData) => {
    try {
      // Validasi data sebelum dikirim
      validateBeritaData(beritaData);

      // Jika ada file foto, gunakan FormData
      if (beritaData.foto instanceof File) {
        const formData = new FormData();
        formData.append("judul", beritaData.judul);
        formData.append("isi", beritaData.isi);

        if (beritaData.tanggalTerbit) {
          // Pastikan format tanggal benar
          const date = new Date(beritaData.tanggalTerbit);
          if (!isNaN(date.getTime())) {
            formData.append("tanggalTerbit", date.toISOString().split("T")[0]);
          } else {
            formData.append(
              "tanggalTerbit",
              new Date().toISOString().split("T")[0]
            );
          }
        } else {
          formData.append(
            "tanggalTerbit",
            new Date().toISOString().split("T")[0]
          );
        }

        formData.append("penulis", beritaData.penulis || "Admin");
        formData.append("status", beritaData.status || "Draft");
        if (beritaData.kategori) {
          formData.append("kategori", beritaData.kategori);
        }
        if (beritaData.ringkasan) {
          formData.append("ringkasan", beritaData.ringkasan);
        }
        formData.append("foto", beritaData.foto);

        const response = await axios.post(`${API_URL}/berita`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
      } else {
        // Jika tidak ada file foto
        // Pastikan format tanggal benar
        if (beritaData.tanggalTerbit) {
          const date = new Date(beritaData.tanggalTerbit);
          if (!isNaN(date.getTime())) {
            beritaData.tanggalTerbit = date.toISOString().split("T")[0];
          }
        }

        const response = await secureApi.post("/berita", beritaData);
        return response.data;
      }
    } catch (error) {
      console.error("Error adding berita:", error);
      throw error;
    }
  },

  // PUT methods
  updateBerita: async (id, beritaData) => {
    try {
      // Validasi data sebelum dikirim
      validateBeritaData(beritaData);

      // Jika ada file foto, gunakan FormData
      if (beritaData.foto instanceof File) {
        const formData = new FormData();
        formData.append("judul", beritaData.judul);
        formData.append("isi", beritaData.isi);

        if (beritaData.tanggalTerbit) {
          // Pastikan format tanggal benar
          const date = new Date(beritaData.tanggalTerbit);
          if (!isNaN(date.getTime())) {
            formData.append("tanggalTerbit", date.toISOString().split("T")[0]);
          } else {
            formData.append(
              "tanggalTerbit",
              new Date().toISOString().split("T")[0]
            );
          }
        } else {
          formData.append(
            "tanggalTerbit",
            new Date().toISOString().split("T")[0]
          );
        }

        formData.append("penulis", beritaData.penulis || "Admin");
        formData.append("status", beritaData.status || "Draft");
        if (beritaData.kategori) {
          formData.append("kategori", beritaData.kategori);
        }
        if (beritaData.ringkasan) {
          formData.append("ringkasan", beritaData.ringkasan);
        }
        formData.append("foto", beritaData.foto);

        // Tambahkan flag untuk menandakan bahwa ini adalah update dengan foto baru
        formData.append("updateFoto", "true");

        const response = await axios.put(`${API_URL}/berita/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
      } else if (beritaData.deleteFoto) {
        // Jika user ingin menghapus foto
        const formData = new FormData();
        formData.append("judul", beritaData.judul);
        formData.append("isi", beritaData.isi);

        if (beritaData.tanggalTerbit) {
          // Pastikan format tanggal benar
          const date = new Date(beritaData.tanggalTerbit);
          if (!isNaN(date.getTime())) {
            formData.append("tanggalTerbit", date.toISOString().split("T")[0]);
          } else {
            formData.append(
              "tanggalTerbit",
              new Date().toISOString().split("T")[0]
            );
          }
        } else {
          formData.append(
            "tanggalTerbit",
            new Date().toISOString().split("T")[0]
          );
        }

        formData.append("penulis", beritaData.penulis || "Admin");
        formData.append("status", beritaData.status || "Draft");
        if (beritaData.kategori) {
          formData.append("kategori", beritaData.kategori);
        }
        if (beritaData.ringkasan) {
          formData.append("ringkasan", beritaData.ringkasan);
        }

        // Tambahkan flag untuk menandakan bahwa foto harus dihapus
        formData.append("deleteFoto", "true");

        const response = await axios.put(`${API_URL}/berita/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
      } else {
        // Jika tidak ada file foto dan tidak menghapus foto
        // Pastikan format tanggal benar
        if (beritaData.tanggalTerbit) {
          const date = new Date(beritaData.tanggalTerbit);
          if (!isNaN(date.getTime())) {
            beritaData.tanggalTerbit = date.toISOString().split("T")[0];
          }
        }

        const response = await secureApi.put(`/berita/${id}`, beritaData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating berita with id ${id}:`, error);
      throw error;
    }
  },

  // Update status only
  updateBeritaStatus: async (id, status) => {
    try {
      // Get current berita data
      const currentBerita = await BeritaServiceAdmin.getBeritaById(id);
      if (!currentBerita) {
        throw new Error("Berita tidak ditemukan");
      }

      // Format tanggal dengan benar
      let tanggalTerbit = currentBerita.tanggalTerbit;
      if (tanggalTerbit) {
        const date = new Date(tanggalTerbit);
        if (!isNaN(date.getTime())) {
          tanggalTerbit = date.toISOString().split("T")[0];
        }
      } else {
        tanggalTerbit = new Date().toISOString().split("T")[0];
      }

      // Update only the status
      const response = await secureApi.put(`/berita/${id}`, {
        judul: currentBerita.judul,
        isi: currentBerita.isi,
        tanggalTerbit: tanggalTerbit,
        penulis: currentBerita.penulis || "Admin",
        status: status,
        kategori: currentBerita.kategori || "Umum",
        ringkasan: currentBerita.ringkasan || "",
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating berita status with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE method
  deleteBerita: async (id) => {
    try {
      // Get berita data first to get the foto path
      const berita = await BeritaServiceAdmin.getBeritaById(id);

      if (berita && berita.foto) {
        // Extract filename from path if needed
        const filename = extractFilename(berita.foto);

        // Delete the berita record
        const response = await secureApi.delete(`/berita/${id}`);

        // Request to delete the associated file
        try {
          await secureApi.delete(`/berita/delete-file/${filename}`);
          `File ${filename} deleted successfully`;
        } catch (fileError) {
          console.error(`Error deleting file ${filename}:`, fileError);
          // Continue even if file deletion fails
        }

        return response.data;
      } else {
        // If no foto, just delete the berita record
        const response = await secureApi.delete(`/berita/${id}`);
        return response.data;
      }
    } catch (error) {
      console.error(`Error deleting berita with id ${id}:`, error);
      throw error;
    }
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
    return `../../storage/${filename}`;
  },
};

export default BeritaServiceAdmin;
