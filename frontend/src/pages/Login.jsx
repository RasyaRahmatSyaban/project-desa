"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, User, Lock, Eye, EyeOff } from "lucide-react"; // Replaced react-icons/fa with lucide-react icons
import axios from "axios"; // axios import added for authService functions

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
      // Simpan juga email untuk digunakan saat update
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

export const update = async (userData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Anda belum login. Silakan login terlebih dahulu.");
  }

  try {
    // Sesuaikan dengan struktur yang diharapkan backend
    // Backend mengharapkan nama, email, dan password
    const email = localStorage.getItem("userEmail"); // Gunakan email yang disimpan saat login

    // Pastikan semua field yang dibutuhkan ada
    if (!email) {
      throw new Error("Email tidak ditemukan. Silakan login kembali.");
    }

    // Pastikan nama tidak kosong
    if (!userData.nama || userData.nama.trim() === "") {
      throw new Error("Nama tidak boleh kosong.");
    }

    // Pastikan password tidak kosong
    if (!userData.password || userData.password.trim() === "") {
      throw new Error("Password tidak boleh kosong.");
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
        },
      }
    );

    // If there's a new token in the response, update it in localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Jika token tidak valid, logout user
      if (
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.message === "Token tidak valid!"
      ) {
        logout();
        throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
      }

      // Server merespons dengan status code di luar range 2xx
      throw new Error(
        error.response.data.message ||
          "Gagal memperbarui akun: " + error.response.status
      );
    } else if (error.request) {
      // Permintaan dibuat tapi tidak ada respons
      throw new Error("Tidak ada respons dari server");
    } else {
      // Terjadi kesalahan saat menyiapkan permintaan
      throw new Error("Error: " + error.message);
    }
  }
};
// --- End of authService.js content ---

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Check if form is valid to enable button
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // Load saved email when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      // Save or remove email based on rememberMe checkbox
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (result.success) {
        window.location.href = "/admin/beranda"; // Redirect after successful login
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ fontFamily: "poppins" }}
    >
      <button
        className="text-gray-700 focus:outline-none absolute top-4 right-4 z-50 p-3"
        aria-label="Close menu"
      >
        <Link to="/">
          <X size={28} />
        </Link>
      </button>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Login Sebagai Admin
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Selamat datang, silahkan masukkan kredensial Anda
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-gray-400" /> {/* Replaced FaUser */}
              </div>
              <input
                type="text"
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" /> {/* Replaced FaLock */}
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Ingat email saya
              </label>
            </div>
            {/* Reset Password Link */}
            <Link
              to="/ResetPassword"
              className="text-sm text-blue-600 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
