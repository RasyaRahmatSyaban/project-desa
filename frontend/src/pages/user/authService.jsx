import axios from "axios"

// Update this with your actual ngrok URL
const API_URL = "https://45b1-180-247-44-189.ngrok-free.app"

// Fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      },
    )

    console.log("Login response:", response.data)

    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token)
      // Simpan juga email untuk digunakan saat update
      localStorage.setItem("userEmail", email)
      return { success: true, token: response.data.data.token }
    } else {
      throw new Error("Token tidak ditemukan dalam response!")
    }
  } catch (error) {
    console.error("Login error:", error)
    throw new Error(error.response?.data?.message || "Login gagal. Cek kredensial dan coba lagi.")
  }
}

// Fungsi untuk logout
export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userEmail")
  // localStorage.removeItem("rememberedEmail");

  // Redirect ke halaman login
  window.location.href = "/"
}

export const update = async (userData) => {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("Anda belum login. Silakan login terlebih dahulu.")
  }

  try {
    // Sesuaikan dengan struktur yang diharapkan backend
    // Backend mengharapkan nama, email, dan password
    const email = localStorage.getItem("userEmail") // Gunakan email yang disimpan saat login

    // Pastikan semua field yang dibutuhkan ada
    if (!email) {
      throw new Error("Email tidak ditemukan. Silakan login kembali.")
    }

    // Pastikan nama tidak kosong
    if (!userData.nama || userData.nama.trim() === "") {
      throw new Error("Nama tidak boleh kosong.")
    }

    // Pastikan password tidak kosong
    if (!userData.password || userData.password.trim() === "") {
      throw new Error("Password tidak boleh kosong.")
    }

    const response = await axios.put(
      `${API_URL}/auth/update`,
      {
        nama: userData.nama,
        email: email, // Gunakan email yang disimpan saat login
        password: userData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      },
    )

    // If there's a new token in the response, update it in localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }

    return response.data
  } catch (error) {
    console.error("Update error:", error)
    if (error.response) {
      // Jika token tidak valid, logout user
      if (
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.message === "Token tidak valid!"
      ) {
        logout()
        throw new Error("Sesi Anda telah berakhir. Silakan login kembali.")
      }

      // Server merespons dengan status code di luar range 2xx
      throw new Error(error.response.data.message || "Gagal memperbarui akun: " + error.response.status)
    } else if (error.request) {
      // Permintaan dibuat tapi tidak ada respons
      throw new Error("Tidak ada respons dari server")
    } else {
      // Terjadi kesalahan saat menyiapkan permintaan
      throw new Error("Error: " + error.message)
    }
  }
}
