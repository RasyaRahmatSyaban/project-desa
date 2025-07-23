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

const PelayananServiceUser = {
  // Hanya method yang diizinkan untuk user
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
}

export default PelayananServiceUser
