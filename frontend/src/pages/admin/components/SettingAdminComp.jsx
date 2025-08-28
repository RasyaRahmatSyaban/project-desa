"use client";

import { useState } from "react";
import {
  FaCog,
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { update } from "../../user/authService";

const SettingAdminComp = () => {
  // State untuk data user
  const [userData, setUserData] = useState({
    nama: "",
    password: "",
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Add these state variables after the existing state declarations
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validasi data
    if (!userData.nama || userData.nama.trim() === "") {
      setError("Nama tidak boleh kosong");
      return;
    }

    if (!userData.password || userData.password.trim() === "") {
      setError("Password tidak boleh kosong");
      return;
    }

    setShowSaveConfirmModal(true);
  };

  // Reset form to empty
  const handleReset = () => {
    setShowResetConfirmModal(true);
  };

  // Add these new functions after handleReset
  const confirmReset = () => {
    setUserData({
      nama: "",
      password: "",
    });
    setShowResetConfirmModal(false);
    setSuccessMessage("Form telah direset");
    setShowSuccessModal(true);
  };

  const confirmSave = async () => {
    setIsLoading(true);
    setShowSaveConfirmModal(false);

    try {
      // Call the update function from authService
      const response = await update(userData);
      setSuccessMessage("Pengaturan berhasil disimpan");
      setShowSuccessModal(true);

      // Reset password field after successful update
      setUserData({ ...userData, password: "" });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ fontFamily: "poppins" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FaCog className="text-purple-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h1>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Kredensial Akun
              </h2>
              <p className="text-gray-600 text-sm">
                Kelola informasi akun dan kredensial login Anda
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="nama"
                  type="text"
                  value={userData.nama}
                  onChange={(e) =>
                    setUserData({ ...userData, nama: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Nama yang akan ditampilkan di dashboard
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={localStorage.getItem("userEmail") || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  placeholder="Email Anda (tidak dapat diubah)"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Email yang digunakan untuk login (tidak dapat diubah)
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Password baru untuk login
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaUndo />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {isLoading ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <FaSave />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Berhasil</h3>
              <p className="text-gray-600">{successMessage}</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Konfirmasi Reset
              </h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin mereset form? Tindakan ini tidak dapat
                dibatalkan.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Konfirmasi Simpan
              </h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin menyimpan perubahan pada pengaturan
                akun?
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingAdminComp;
