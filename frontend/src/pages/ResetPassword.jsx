"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Mail } from "lucide-react"; // Using Lucide icons
import toast from "../components/Toast"; // Import the toast utility
import axios from "axios";

// You should replace this with your actual API URL
const API_URL = import.meta.env.VITE_API_URL;

// Function to call the backend reset password route
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/reset-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengirim permintaan reset password. Coba lagi."
    );
  }
};

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email); // Call the new function
      setSuccessMessage(
        result.message || "Link reset password telah dikirim ke email Anda."
      );
      toast.success(
        "Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.",
        { duration: 5000 }
      );
      setEmail(""); // Clear email input after success
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== "";

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
          Reset Password
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Masukkan email Anda untuk menerima link reset password.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400" />{" "}
                {/* Using Mail icon for email */}
              </div>
              <input
                type="email"
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                required
              />
            </div>
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
            {isLoading ? "Memproses..." : "Kirim Link Reset Password"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
