import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Buat axios instance dengan default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const MediaServiceUser = {
  // Hanya method yang diizinkan untuk user
  getAllMedia: async () => {
    try {
      const response = await api.get("/media");
      const data = response.data.data || [];
      // Tambahkan created_at jika tidak ada (meniru perilaku admin service)
      return data.map((item) => {
        if (!item.created_at && item.file) {
          const filenameParts = item.file.split(".");
          const possibleTimestamp = Number.parseInt(filenameParts[0]);
          if (!isNaN(possibleTimestamp)) {
            item.created_at = new Date(possibleTimestamp).toISOString();
          } else {
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
      if (item && !item.created_at && item.file) {
        const filenameParts = item.file.split(".");
        const possibleTimestamp = Number.parseInt(filenameParts[0]);
        if (!isNaN(possibleTimestamp)) {
          item.created_at = new Date(possibleTimestamp).toISOString();
        } else {
          item.created_at = new Date().toISOString();
        }
      }
      return item;
    } catch (error) {
      console.error(`Error fetching media with id ${id}:`, error);
      return null;
    }
  },

  // Get media URL
  getMediaUrl: (filename) => {
    if (!filename) return null;

    // If path already starts with http:// or https://, return as is
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename;
    }

    // Ekstrak nama file dari path jika ada (selaras dengan admin service)
    const filenameOnly = filename.split("/").pop();

    // Return the complete URL ke uploads
    return `${API_URL}/uploads/${filenameOnly}`;
  },

  // Utility function untuk format tanggal
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

  // Ekstrak tahun dari item media (selaras dengan admin)
  extractYear: (item) => {
    if (item?.created_at) {
      const date = new Date(item.created_at);
      if (!isNaN(date.getTime())) {
        return date.getFullYear().toString();
      }
      if (typeof item.created_at === "string" && item.created_at.length >= 4) {
        return item.created_at.substring(0, 4);
      }
    }

    if (item?.file) {
      const filenameParts = item.file.split(".");
      const possibleTimestamp = Number.parseInt(filenameParts[0]);
      if (!isNaN(possibleTimestamp)) {
        return new Date(possibleTimestamp).getFullYear().toString();
      }
    }

    return new Date().getFullYear().toString();
  },

  // Generate thumbnail untuk video (selaras dengan admin)
  getVideoThumbnail: (item) => {
    if (!item || !item.file) return "/placeholder.svg?height=300&width=400";

    if (item.thumbnail) {
      const thumbnailUrl = MediaServiceUser.getMediaUrl(item.thumbnail);
      return thumbnailUrl;
    }

    return "/placeholder.svg?height=300&width=400";
  },
};

export default MediaServiceUser;
