import axios from "axios";
import { logout } from "../user/authService";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Add request interceptor to include auth token
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

const AdminService = {
  getAllUsers: async () => {
    const response = await api.get("/auth/all");
    return response.data.data || [];
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/current-user");
    return response.data.data || {};
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/auth/${id}`);
    return response.data;
  },

  transferSuperadmin: async (toId) => {
    const response = await api.post("/auth/transfer-superadmin", { toId });
    return response.data;
  },

  addUser: async (nama, email, password, role = "admin") => {
    const response = await api.post("/auth/add", {
      nama,
      email,
      password,
      role,
    });
    return response.data;
  },

  update: async (userData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    try {
      if (!userData.email?.trim()) {
        throw new Error("Email tidak boleh kosong");
      }

      if (!userData.nama?.trim() && !userData.password?.trim()) {
        throw new Error("Isi minimal salah satu field (nama atau password)");
      }

      const payload = {
        email: userData.email.trim(),
      };

      if (userData.nama?.trim()) {
        payload.nama = userData.nama.trim();
      }

      if (userData.password?.trim()) {
        payload.password = userData.password.trim();
      }

      const response = await axios.put(`${API_URL}/auth/update`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data &&
          error.response.data.message === "Token tidak valid!"
        ) {
          logout();
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw new Error(
          error.response.data.message ||
            "Gagal memperbarui akun: " + error.response.status
        );
      } else if (error.request) {
        throw new Error("Tidak ada respons dari server");
      } else {
        throw new Error("Error: " + error.message);
      }
    }
  },
};

export default AdminService;
