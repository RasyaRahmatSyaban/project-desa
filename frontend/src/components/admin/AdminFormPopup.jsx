import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

const AdminFormPopup = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
  });

  // State lokal untuk mengontrol animasi fade-in/out
  const [isVisible, setIsVisible] = useState(false);

  // Efek untuk mengontrol visibilitas dan animasi
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Menonaktifkan scroll saat popup terbuka
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      // Mengaktifkan kembali scroll setelah popup tertutup
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Popup hanya akan dirender jika isOpen true
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white backdrop-blur-xl rounded-2xl shadow-xl p-6 w-full max-w-md relative transition-transform duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaUserPlus className="text-blue-500" size={24} />
          </div>
          <h2 className="font-bold text-2xl text-gray-800">
            Tambah Admin Baru
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <div className="relative">
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-200"
                placeholder="Masukkan nama"
              />
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-200"
                placeholder="Masukkan email"
              />
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-200"
                placeholder="Masukkan password"
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              Tambah Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormPopup;
