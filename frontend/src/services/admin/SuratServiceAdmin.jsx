import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Add request interceptor to include auth token when available
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

const extractFilename = (path) => {
  if (!path) return null;

  // Jika path berisi 'uploads/berita/', ekstrak hanya nama filenya
  if (path.includes("uploads/")) {
    return path.split("/").pop();
  }

  // Jika tidak, kembalikan path asli
  return path;
};

// Helper function to find file field in an object
const findFileField = (item) => {
  // Check for the 'file' field first (as seen in the database)
  if (item.file) {
    `Found file in field: file with value: ${item.file}`;
    return item.file;
  }

  // List of other possible file field names as fallback
  const possibleFileFields = [
    "file_surat",
    "fileSurat",
    "dokumen",
    "attachment",
    "lampiran",
    "document",
    "pdf",
    "fileUrl",
    "url",
  ];

  // Check each possible field name
  for (const field of possibleFileFields) {
    if (item[field]) {
      `Found file in field: ${field} with value: ${item[field]}`;
      return item[field];
    }
  }

  // If no field is found, log all available fields for debugging
  "Available fields in item:", Object.keys(item);
  return null;
};

const SuratServiceAdmin = {
  // GET methods - accessible by both admin and user
  getAllSurat: async () => {
    try {
      // Fetch surat masuk
      const resMasuk = await api.get("/surat/suratMasuk");
      // Fetch surat keluar
      const resKeluar = await api.get("/surat/suratKeluar");

      // Ensure data is an array
      const suratMasukData = Array.isArray(resMasuk.data) ? resMasuk.data : [];
      const suratKeluarData = Array.isArray(resKeluar.data)
        ? resKeluar.data
        : [];

      "Surat Masuk Data:", suratMasukData;
      "Surat Keluar Data:", suratKeluarData;

      // Transform data for display
      const transformedMasuk = suratMasukData.map((item) => {
        const fileField = findFileField(item);
        return {
          id: item.id,
          jenis: "Surat Masuk",
          nomor: item.nomorSurat || "",
          perihal: item.perihal || "",
          judul: item.perihal || "",
          pengirim: item.pengirim || "",
          tanggal: item.tanggalTerima || new Date().toISOString(),
          status: "Diterima",
          file: fileField, // Use 'file' to match database field
          // Store the raw item for debugging
          _raw: item,
        };
      });

      const transformedKeluar = suratKeluarData.map((item) => {
        const fileField = findFileField(item);
        return {
          id: item.id,
          jenis: "Surat Keluar",
          nomor: item.nomorSurat || "",
          perihal: item.perihal || "",
          judul: item.perihal || "",
          pengirim: item.penerima || "", // penerima disimpan di field pengirim untuk UI
          tanggal: item.tanggalKirim || new Date().toISOString(),
          status: "Terkirim",
          file: fileField, // Use 'file' to match database field
          // Store the raw item for debugging
          _raw: item,
        };
      });

      const combinedData = [...transformedMasuk, ...transformedKeluar];
      "Combined Data:", combinedData;
      return combinedData;
    } catch (error) {
      console.error("Error fetching all surat:", error);
      return [];
    }
  },

  getSuratMasuk: async () => {
    try {
      const response = await api.get("/surat/suratMasuk");
      const suratMasukData = Array.isArray(response.data) ? response.data : [];

      "Surat Masuk Data:", suratMasukData;

      // Transform data for display
      return suratMasukData.map((item) => {
        const fileField = findFileField(item);
        return {
          id: item.id,
          jenis: "Surat Masuk",
          nomor: item.nomorSurat || "",
          perihal: item.perihal || "",
          judul: item.perihal || "",
          pengirim: item.pengirim || "",
          tanggal: item.tanggalTerima || new Date().toISOString(),
          status: "Diterima",
          file: fileField, // Use 'file' to match database field
          _raw: item,
        };
      });
    } catch (error) {
      console.error("Error fetching surat masuk:", error);
      return [];
    }
  },

  getSuratKeluar: async () => {
    try {
      const response = await api.get("/surat/suratKeluar");
      const suratKeluarData = Array.isArray(response.data) ? response.data : [];

      "Surat Keluar Data:", suratKeluarData;

      // Transform data for display
      return suratKeluarData.map((item) => {
        const fileField = findFileField(item);
        return {
          id: item.id,
          jenis: "Surat Keluar",
          nomor: item.nomorSurat || "",
          perihal: item.perihal || "",
          judul: item.perihal || "",
          pengirim: item.penerima || "", // penerima disimpan di field pengirim untuk UI
          tanggal: item.tanggalKirim || new Date().toISOString(),
          status: "Terkirim",
          file: fileField, // Use 'file' to match database field
          _raw: item,
        };
      });
    } catch (error) {
      console.error("Error fetching surat keluar:", error);
      return [];
    }
  },

  // Get surat by year - for user page
  getSuratByYear: async (year) => {
    try {
      const allSurat = await SuratServiceAdmin.getAllSurat();

      // Filter by year
      return allSurat.filter((surat) => {
        // Pastikan tanggal valid
        if (!surat.tanggal) return false;

        let suratYear;
        try {
          // Coba parse tanggal dengan berbagai format
          const date = new Date(surat.tanggal);

          // Periksa apakah tanggal valid
          if (isNaN(date.getTime())) {
            // Jika format tanggal tidak standar, coba ekstrak tahun dengan regex
            const yearMatch = surat.tanggal.match(/\d{4}/);
            suratYear = yearMatch ? yearMatch[0] : null;
          } else {
            suratYear = date.getFullYear().toString();
          }

          return suratYear === year;
        } catch (err) {
          console.error("Error parsing date:", surat.tanggal, err);
          return false;
        }
      });
    } catch (error) {
      console.error(`Error fetching surat for year ${year}:`, error);
      return [];
    }
  },

  // Get available years - for user page
  getAvailableYears: async () => {
    try {
      const allSurat = await SuratServiceAdmin.getAllSurat();

      // Extract unique years with better date handling
      const years = allSurat.reduce((acc, surat) => {
        if (!surat.tanggal) return acc;

        let year;
        try {
          // Coba parse tanggal dengan berbagai format
          const date = new Date(surat.tanggal);

          // Periksa apakah tanggal valid
          if (isNaN(date.getTime())) {
            // Jika format tanggal tidak standar, coba ekstrak tahun dengan regex
            const yearMatch = surat.tanggal.match(/\d{4}/);
            year = yearMatch ? yearMatch[0] : null;
          } else {
            year = date.getFullYear().toString();
          }

          if (year && !acc.includes(year)) {
            acc.push(year);
          }
        } catch (err) {
          console.error("Error parsing date:", surat.tanggal, err);
        }

        return acc;
      }, []);

      // Jika tidak ada tahun yang ditemukan, gunakan tahun default
      if (years.length === 0) {
        const currentYear = new Date().getFullYear();
        return [
          currentYear.toString(),
          (currentYear - 1).toString(),
          (currentYear - 2).toString(),
        ];
      }

      // Sort years in descending order
      return years.sort((a, b) => b - a);
    } catch (error) {
      console.error("Error fetching available years:", error);
      // Fallback to default years
      const currentYear = new Date().getFullYear();
      return [
        currentYear.toString(),
        (currentYear - 1).toString(),
        (currentYear - 2).toString(),
      ];
    }
  },

  // POST methods - admin only
  addSuratMasuk: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token required");
      }

      // Debug: Log what we're sending to the server
      ("FormData fields being sent:");
      for (const pair of formData.entries()) {
        `${pair[0]}: ${typeof pair[1] === "object" ? "File object" : pair[1]}`;
      }

      // Check if the file field exists and rename it to match server expectation
      if (formData.has("file")) {
        const fileObject = formData.get("file");
        formData.delete("file");
        formData.append("file_surat", fileObject);
        ("Renamed 'file' field to 'file_surat' to match server expectation");
      }

      // Use axios directly with the token in headers
      const response = await axios.post(
        `${API_URL}/surat/addSuratMasuk`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding surat masuk:", error);
      // More detailed error logging
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      }
      throw error;
    }
  },

  addSuratKeluar: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token required");
      }

      // Debug: Log what we're sending to the server
      ("FormData fields being sent:");
      for (const pair of formData.entries()) {
        `${pair[0]}: ${typeof pair[1] === "object" ? "File object" : pair[1]}`;
      }

      // Check if the file field exists and rename it to match server expectation
      if (formData.has("file")) {
        const fileObject = formData.get("file");
        formData.delete("file");
        formData.append("file_surat", fileObject);
        ("Renamed 'file' field to 'file_surat' to match server expectation");
      }

      // Use axios directly with the token in headers
      const response = await axios.post(
        `${API_URL}/surat/addSuratKeluar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding surat keluar:", error);
      // More detailed error logging
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      }
      throw error;
    }
  },

  // PUT methods - admin only
  updateSuratMasuk: async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token required");
      }

      // Check if the file field exists and rename it to match server expectation
      if (formData.has("file")) {
        const fileObject = formData.get("file");
        formData.delete("file");
        formData.append("file_surat", fileObject);
        ("Renamed 'file' field to 'file_surat' to match server expectation");
      }

      const response = await axios.put(
        `${API_URL}/surat/update-surat-masuk/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating surat masuk:", error);
      throw error;
    }
  },

  updateSuratKeluar: async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token required");
      }

      // Check if the file field exists and rename it to match server expectation
      if (formData.has("file")) {
        const fileObject = formData.get("file");
        formData.delete("file");
        formData.append("file_surat", fileObject);
        ("Renamed 'file' field to 'file_surat' to match server expectation");
      }

      const response = await axios.put(
        `${API_URL}/surat/update-surat-keluar/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating surat keluar:", error);
      throw error;
    }
  },

  // DELETE methods - admin only
  deleteSuratMasuk: async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token required");
      }

      // First, get the surat to find the file path
      const suratList = await SuratServiceAdmin.getSuratMasuk();
      const surat = suratList.find((item) => item.id === id);

      // If there's a file, request its deletion
      if (surat && surat.file) {
        try {
          // Request file deletion from server
          await axios.delete(`${API_URL}/surat/delete-file`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { filePath: surat.file },
          });
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Continue with surat deletion even if file deletion fails
        }
      }

      // Delete the surat record
      const response = await axios.delete(
        `${API_URL}/surat/delete-surat-masuk/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting surat masuk:", error);
      throw error;
    }
  },

  deleteSuratKeluar: async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token required");
      }

      // First, get the surat to find the file path
      const suratList = await SuratServiceAdmin.getSuratKeluar();
      const surat = suratList.find((item) => item.id === id);

      // If there's a file, request its deletion
      if (surat && surat.file) {
        try {
          // Request file deletion from server
          await axios.delete(`${API_URL}/surat/delete-file`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { filePath: surat.file },
          });
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Continue with surat deletion even if file deletion fails
        }
      }

      // Delete the surat record
      const response = await axios.delete(
        `${API_URL}/surat/delete-surat-keluar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting surat keluar:", error);
      throw error;
    }
  },

  // File methods - accessible by both admin and user
  getFileUrl: (fileName) => {
    if (!fileName) {
      return null;
    }

    // If it's already a full URL, return as is
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
      return fileName;
    }

    // For files in the berita directory (as seen in your setup)
    const fileUrl = extractFilename(fileName);
    return `${BASE_URL}/uploads/${fileUrl}`;
  },

  // Download file as blob to avoid browser blocking
  downloadFile: async (fileName) => {
    if (!fileName) return null;

    try {
      const fileUrl = SuratServiceAdmin.getFileUrl(fileName);

      // Fetch the file as a blob
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch file: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName.split("/").pop(); // Extract filename

      // Append to document, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      return true;
    } catch (error) {
      console.error("Error downloading file:", error);
      return false;
    }
  },

  // Check if file exists
  checkFileExists: async (fileName) => {
    if (!fileName) return false;

    try {
      const fileUrl = SuratServiceAdmin.getFileUrl(fileName);
      const response = await fetch(fileUrl, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.error("Error checking if file exists:", error);
      return false;
    }
  },
};

export default SuratServiceAdmin;
