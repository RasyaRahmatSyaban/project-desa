import axios from "axios"

// Update this with your actual ngrok URL
const API_URL = "https://45b1-180-247-44-189.ngrok-free.app"

// Buat axios instance dengan default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
})

const MediaServiceUser = {
  // Hanya method yang diizinkan untuk user
  getAllMedia: async () => {
    try {
      console.log("Fetching media from:", `${API_URL}/media`)
      const response = await api.get("/media")
      console.log("Media response:", response.data)
      return response.data.data || []
    } catch (error) {
      console.error("Error fetching media:", error)
      return []
    }
  },

  getMediaById: async (id) => {
    try {
      const response = await api.get(`/media/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching media with id ${id}:`, error)
      return null
    }
  },

  // Get media URL
  getMediaUrl: (filename) => {
    if (!filename) return null

    // If path already starts with http:// or https://, return as is
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename
    }

    // Ekstrak nama file dari path jika ada
    const filenameOnly = filename.split("/").pop()

    // Return the complete URL using ngrok
    return `${API_URL}/uploads/${filenameOnly}`
  },

  // Utility function untuk format tanggal
  formatDate: (dateString) => {
    if (!dateString) return "-"

    try {
      const date = new Date(dateString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString
      }

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (err) {
      console.error("Error formatting date:", dateString, err)
      return dateString
    }
  },
}

export default MediaServiceUser
