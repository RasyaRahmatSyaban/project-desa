"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4"
      style={{ fontFamily: "poppins" }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FaSignOutAlt className="text-red-500 text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Anda telah keluar
        </h1>
        <p className="text-gray-500 mb-6">
          Terima kasih telah menggunakan dashboard admin. Anda telah berhasil
          keluar dari sistem.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Login Kembali
        </button>
      </div>
    </div>
  );
}
