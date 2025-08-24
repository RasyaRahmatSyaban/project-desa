import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
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
};

export default AdminService;
