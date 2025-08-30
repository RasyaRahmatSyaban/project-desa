import axios from "axios";

// You should replace this with your actual API URL
const API_URL = import.meta.env.VITE_API_URL;

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
      }
    );

    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("userEmail", email);
      return { success: true, token: response.data.data.token };
    } else {
      throw new Error("Token tidak ditemukan dalam response!");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Login gagal. Cek kredensial dan coba lagi."
    );
  }
};

// Fungsi untuk logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  // localStorage.removeItem("rememberedEmail");

  // Redirect ke halaman login
  window.location.href = "/";
};
