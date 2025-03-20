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

const SettingAdminComp = () => {
  // Default values that would be set by the developer
  const DEFAULT_VALUES = {
    name: "Admin",
    email: "admin@example.com",
    password: "",
  };

  // State for form data
  const [formData, setFormData] = useState({
    name: DEFAULT_VALUES.name,
    email: DEFAULT_VALUES.email,
    password: "",
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Add these state variables after the existing state declarations
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] =
    useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if password was changed
    if (formData.password && formData.password.trim() !== "") {
      setPasswordChanged(true);
      setShowPasswordConfirmModal(true);
    } else {
      setShowSaveConfirmModal(true);
    }
  };

  // Reset form to default values
  const handleReset = () => {
    setShowResetConfirmModal(true);
  };

  // Add these new functions after handleReset
  const confirmReset = () => {
    setFormData(DEFAULT_VALUES);
    setShowResetConfirmModal(false);
    setSuccessMessage("Pengaturan telah direset ke nilai default");
    setShowSuccessModal(true);
  };

  const confirmSave = () => {
    setIsLoading(true);
    setShowSaveConfirmModal(false);

    // Simulate API call
    setTimeout(() => {
      console.log("Saving settings:", formData);
      setSuccessMessage("Pengaturan berhasil disimpan");
      setShowSuccessModal(true);
      setIsLoading(false);
    }, 1000);
  };

  const confirmPasswordChange = () => {
    setIsLoading(true);
    setShowPasswordConfirmModal(false);

    // Simulate API call
    setTimeout(() => {
      console.log("Saving settings with password change:", formData);
      setSuccessMessage("Pengaturan dan password berhasil diperbarui");
      setShowSuccessModal(true);
      setIsLoading(false);
      // Reset password field after successful update
      setFormData({ ...formData, password: "" });
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="admin@example.com"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Email yang digunakan untuk login dan notifikasi
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
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
                Biarkan kosong jika tidak ingin mengubah password
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaUndo />
                <span>Reset ke Default</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Konfirmasi Reset
              </h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin mereset semua pengaturan ke nilai
                default? Tindakan ini tidak dapat dibatalkan.
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {/* Password Change Confirmation Modal */}
      {showPasswordConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Konfirmasi Perubahan Password
              </h3>
              <p className="text-gray-600 text-sm">
                Anda akan mengubah password akun. Apakah Anda yakin ingin
                melanjutkan?
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmPasswordChange}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ya, Ubah Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingAdminComp;
