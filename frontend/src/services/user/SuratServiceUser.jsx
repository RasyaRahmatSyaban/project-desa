import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Axios instance without auth for public (user) access
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Response interceptor: unwrap nested data and handle 404s gracefully
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 404) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(error);
  }
);

const extractFilename = (path) => {
  if (!path) return null;
  if (path.includes("uploads/")) {
    return path.split("/").pop();
  }
  return path;
};

// Try to find a reasonable file field in an item
const findFileField = (item) => {
  if (item.file) return item.file;
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
  for (const field of possibleFileFields) {
    if (item[field]) return item[field];
  }
  return null;
};

const SuratServiceUser = {
  // Combine surat masuk and keluar for public view
  getAllSurat: async () => {
    try {
      const resMasuk = await api.get("/surat/suratMasuk");
      const resKeluar = await api.get("/surat/suratKeluar");

      const suratMasukData = Array.isArray(resMasuk.data) ? resMasuk.data : [];
      const suratKeluarData = Array.isArray(resKeluar.data) ? resKeluar.data : [];

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
          file: fileField,
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
          pengirim: item.penerima || "",
          tanggal: item.tanggalKirim || new Date().toISOString(),
          status: "Terkirim",
          file: fileField,
          _raw: item,
        };
      });

      return [...transformedMasuk, ...transformedKeluar];
    } catch (error) {
      console.error("Error fetching all surat:", error);
      return [];
    }
  },

  // Filter surat by year (string)
  getSuratByYear: async (year) => {
    try {
      const allSurat = await SuratServiceUser.getAllSurat();
      return allSurat.filter((surat) => {
        if (!surat.tanggal) return false;
        let suratYear;
        try {
          const date = new Date(surat.tanggal);
          if (isNaN(date.getTime())) {
            const yearMatch = String(surat.tanggal).match(/\d{4}/);
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

  // List available years descending
  getAvailableYears: async () => {
    try {
      const allSurat = await SuratServiceUser.getAllSurat();
      const years = allSurat.reduce((acc, surat) => {
        if (!surat.tanggal) return acc;
        let year;
        try {
          const date = new Date(surat.tanggal);
          if (isNaN(date.getTime())) {
            const yearMatch = String(surat.tanggal).match(/\d{4}/);
            year = yearMatch ? yearMatch[0] : null;
          } else {
            year = date.getFullYear().toString();
          }
          if (year && !acc.includes(year)) acc.push(year);
        } catch (err) {
          console.error("Error parsing date:", surat.tanggal, err);
        }
        return acc;
      }, []);

      if (years.length === 0) {
        const currentYear = new Date().getFullYear();
        return [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
      }

      return years.sort((a, b) => b - a);
    } catch (error) {
      console.error("Error fetching available years:", error);
      const currentYear = new Date().getFullYear();
      return [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
    }
  },

  // File helpers for public access
  getFileUrl: (fileName) => {
    if (!fileName) return null;
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
      return fileName;
    }
    const fileUrl = extractFilename(fileName);
    return `${BASE_URL}/uploads/${fileUrl}`;
  },

  // Download as blob and trigger a download in browser
  downloadFile: async (fileName) => {
    if (!fileName) return null;
    try {
      const fileUrl = SuratServiceUser.getFileUrl(fileName);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = String(fileName).split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      return true;
    } catch (error) {
      console.error("Error downloading file:", error);
      return false;
    }
  },

  // HEAD request to check existence
  checkFileExists: async (fileName) => {
    if (!fileName) return false;
    try {
      const fileUrl = SuratServiceUser.getFileUrl(fileName);
      const response = await fetch(fileUrl, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.error("Error checking if file exists:", error);
      return false;
    }
  },
};

export default SuratServiceUser;
