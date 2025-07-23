import axios from "axios"

const API_URL = "https://45b1-180-247-44-189.ngrok-free.app" // Update this with your actual ngrok URL

// Buat axios instance dengan default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
})

// Add request interceptor untuk include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Ensure ngrok header is always present
    config.headers["ngrok-skip-browser-warning"] = "true"
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

const PelayananServiceAdmin = {
  // GET methods
  getAllPelayanan: async () => {
    try {
      console.log("Fetching pelayanan from:", `${API_URL}/pelayanan`)
      const response = await api.get("/pelayanan")
      console.log("Pelayanan response:", response.data)
      return response.data.data || []
    } catch (error) {
      console.error("Error fetching pelayanan:", error)
      return []
    }
  },

  getPelayananById: async (id) => {
    try {
      const response = await api.get(`/pelayanan/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching pelayanan with id ${id}:`, error)
      return null
    }
  },

  // POST method
  addPelayanan: async (pelayananData) => {
    try {
      const response = await api.post("/pelayanan", pelayananData)
      return response.data
    } catch (error) {
      console.error("Error adding pelayanan:", error)
      throw error
    }
  },

  // PUT method
  updatePelayanan: async (id, pelayananData) => {
    try {
      const response = await api.put(`/pelayanan/${id}`, pelayananData)
      return response.data
    } catch (error) {
      console.error(`Error updating pelayanan with id ${id}:`, error)
      throw error
    }
  },

  // DELETE method
  deletePelayanan: async (id) => {
    try {
      const response = await api.delete(`/pelayanan/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting pelayanan with id ${id}:`, error)
      throw error
    }
  },
}

export default PelayananServiceAdmin
