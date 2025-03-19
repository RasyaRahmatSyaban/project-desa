"use client";

import { useState, useEffect } from "react";
import {
  FaNewspaper,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaTags,
  FaSpinner,
} from "react-icons/fa";
import BeritaServiceAdmin from "../services/BeritaServiceAdmin";

const BeritaAdmin = () => {
  // State untuk data
  const [beritaData, setBeritaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("semua");

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Umum",
    tanggalTerbit: "",
    penulis: "",
    status: "Draft",
    ringkasan: "",
    isi: "",
  });

  // Definisi animasi CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
        }
    }
    
    .animate-modalFadeIn {
      animation: modalFadeIn 0.3s ease-out forwards;
    }
  `;
  document.head.appendChild(style);

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchBeritaData();
  }, []);

  // Fetch berita data
  const fetchBeritaData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await BeritaServiceAdmin.getAllBerita();

      // Transform data to match our UI needs
      const transformedData = data.map((item) => ({
        id: item.id,
        judul: item.judul,
        kategori: item.kategori || "Umum", // Default to "Umum" if not provided
        tanggalTerbit: item.tanggalTerbit,
        penulis: item.penulis,
        status: item.status || "Dipublikasi", // Default to "Dipublikasi" if not provided
        ringkasan: item.ringkasan || item.isi?.substring(0, 150) || "", // Use first 150 chars of isi as ringkasan if not provided
        isi: item.isi,
      }));

      setBeritaData(transformedData);
    } catch (err) {
      console.error("Error fetching berita data:", err);
      setError("Gagal memuat data berita.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on active tab and search query
  const filteredData = beritaData.filter((item) => {
    const matchesSearch =
      (item.judul?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.kategori?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (item.penulis?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeTab === "semua" ||
      (activeTab === "dipublikasi" && item.status === "Dipublikasi") ||
      (activeTab === "draft" && item.status === "Draft");

    return matchesSearch && matchesFilter;
  });

  // Count by status
  const countPublished = beritaData.filter(
    (item) => item.status === "Dipublikasi"
  ).length;
  const countDraft = beritaData.filter(
    (item) => item.status === "Draft"
  ).length;

  // Handle actions
  const handleAdd = () => {
    setFormData({
      judul: "",
      kategori: "Umum",
      tanggalTerbit: new Date().toISOString().split("T")[0],
      penulis: "Admin",
      status: "Draft",
      ringkasan: "",
      isi: "",
    });
    setShowAddModal(true);
  };

  const handleEdit = (id) => {
    const item = beritaData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setFormData({
        judul: item.judul,
        kategori: item.kategori || "Umum",
        tanggalTerbit: item.tanggalTerbit,
        penulis: item.penulis,
        status: item.status || "Draft",
        ringkasan: item.ringkasan || "",
        isi: item.isi || "",
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = (id) => {
    const item = beritaData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setShowDeleteModal(true);
    }
  };

  const handlePreview = (id) => {
    const item = beritaData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setShowPreviewModal(true);
    }
  };

  const saveNewItem = async () => {
    if (!token) {
      alert("Anda harus login sebagai admin untuk menambahkan berita");
      return;
    }

    try {
      // Validasi form
      if (
        !formData.judul ||
        !formData.isi ||
        !formData.tanggalTerbit ||
        !formData.penulis
      ) {
        alert("Judul, isi, tanggal terbit, dan penulis wajib diisi!");
        return;
      }

      // Prepare data for API
      const newBeritaData = {
        judul: formData.judul,
        isi: formData.isi,
        tanggalTerbit: formData.tanggalTerbit,
        penulis: formData.penulis,
        // Additional fields not in the API but we'll keep them in our transformed data
        kategori: formData.kategori,
        status: formData.status,
        ringkasan: formData.ringkasan,
      };

      // Send to API
      const result = await BeritaServiceAdmin.addBerita(newBeritaData);

      // Add the new item to our state with transformed data
      const newItem = {
        id: result.id,
        judul: result.judul,
        kategori: formData.kategori,
        tanggalTerbit: formData.tanggalTerbit,
        penulis: formData.penulis,
        status: formData.status,
        ringkasan: formData.ringkasan || formData.isi.substring(0, 150),
        isi: result.isi,
      };

      setBeritaData([...beritaData, newItem]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Error saving berita:", err);
      alert("Terjadi kesalahan saat menyimpan berita.");
    }
  };

  const saveEditedItem = async () => {
    if (!token) {
      alert("Anda harus login sebagai admin untuk mengedit berita");
      return;
    }

    try {
      // Validasi form
      if (
        !formData.judul ||
        !formData.isi ||
        !formData.tanggalTerbit ||
        !formData.penulis
      ) {
        alert("Judul, isi, tanggal terbit, dan penulis wajib diisi!");
        return;
      }

      // Validasi currentItem
      if (!currentItem || !currentItem.id) {
        alert("Data berita yang akan diedit tidak ditemukan!");
        return;
      }

      // Prepare data for API
      const editBeritaData = {
        judul: formData.judul,
        isi: formData.isi,
        tanggalTerbit: formData.tanggalTerbit,
        penulis: formData.penulis,
        // Additional fields not in the API but we'll keep them in our transformed data
        kategori: formData.kategori,
        status: formData.status,
        ringkasan: formData.ringkasan,
      };

      // Send to API
      await BeritaServiceAdmin.updateBerita(currentItem.id, editBeritaData);

      // Update our state with transformed data
      const updatedData = beritaData.map((item) =>
        item.id === currentItem.id
          ? {
              ...item,
              judul: formData.judul,
              kategori: formData.kategori,
              tanggalTerbit: formData.tanggalTerbit,
              penulis: formData.penulis,
              status: formData.status,
              ringkasan: formData.ringkasan || formData.isi.substring(0, 150),
              isi: formData.isi,
            }
          : item
      );

      setBeritaData(updatedData);
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating berita:", err);
      alert("Terjadi kesalahan saat memperbarui berita.");
    }
  };

  const confirmDelete = async () => {
    if (!token) {
      alert("Anda harus login sebagai admin untuk menghapus berita");
      return;
    }

    try {
      // Validasi currentItem
      if (!currentItem || !currentItem.id) {
        alert("Tidak ada berita yang dipilih untuk dihapus!");
        return;
      }

      // Send to API
      await BeritaServiceAdmin.deleteBerita(currentItem.id);

      // Update our state
      const updatedData = beritaData.filter(
        (item) => item.id !== currentItem.id
      );
      setBeritaData(updatedData);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting berita:", err);
      alert("Terjadi kesalahan saat menghapus berita.");
    }
  };

  const publishBerita = async (id) => {
    if (!token) {
      alert("Anda harus login sebagai admin untuk mempublikasikan berita");
      return;
    }

    try {
      // Validasi item
      const item = beritaData.find((item) => item.id === id);
      if (!item) {
        alert("Berita tidak ditemukan!");
        return;
      }

      // Prepare data for API
      const publishData = {
        judul: item.judul,
        isi: item.isi,
        tanggalTerbit: item.tanggalTerbit,
        penulis: item.penulis,
        kategori: item.kategori,
        status: "Dipublikasi",
        ringkasan: item.ringkasan,
      };

      // Send to API
      await BeritaServiceAdmin.updateBerita(id, publishData);

      // Update status in our state
      const updatedData = beritaData.map((beritaItem) =>
        beritaItem.id === id
          ? { ...beritaItem, status: "Dipublikasi" }
          : beritaItem
      );

      setBeritaData(updatedData);
      setShowPreviewModal(false);
    } catch (err) {
      console.error("Error publishing berita:", err);
      alert("Terjadi kesalahan saat mempublikasikan berita.");
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Dipublikasi":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "kesehatan":
        return "bg-red-100 text-red-800";
      case "pendidikan":
        return "bg-blue-100 text-blue-800";
      case "infrastruktur":
        return "bg-orange-100 text-orange-800";
      case "pertanian":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      // Periksa apakah tanggal valid
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", dateString, err);
      return dateString;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FaNewspaper className="text-purple-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Berita
              </h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaNewspaper className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {beritaData.length}
            </div>
            <p className="text-sm text-gray-600">Berita tersimpan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Dipublikasi
              </h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <FaNewspaper className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countPublished}
            </div>
            <p className="text-sm text-gray-600">Berita dipublikasikan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Draft</h3>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FaNewspaper className="text-yellow-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countDraft}
            </div>
            <p className="text-sm text-gray-600">Berita dalam draft</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("semua")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "semua"
                  ? "bg-purple-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaNewspaper
                className={
                  activeTab === "semua" ? "text-white" : "text-purple-500"
                }
              />
              <span>Semua Berita</span>
            </button>
            <button
              onClick={() => setActiveTab("dipublikasi")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "dipublikasi"
                  ? "bg-green-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaNewspaper
                className={
                  activeTab === "dipublikasi" ? "text-white" : "text-green-500"
                }
              />
              <span>Dipublikasi</span>
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "draft"
                  ? "bg-yellow-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaNewspaper
                className={
                  activeTab === "draft" ? "text-white" : "text-yellow-500"
                }
              />
              <span>Draft</span>
            </button>
          </div>
        </div>

        {/* Berita Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Daftar Berita</h2>
              <p className="text-gray-600 text-sm">
                Kelola berita dan artikel website desa
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <FaPlus className="text-white" />
                <span>Tambah Berita</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-purple-500 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">Memuat data berita...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchBeritaData}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 rounded-tl-lg">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Penulis
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 rounded-tr-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((berita) => (
                      <tr key={berita.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {berita.judul}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              berita.kategori
                            )}`}
                          >
                            {berita.kategori || "Umum"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            {formatDate(berita.tanggalTerbit)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            {berita.penulis}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              berita.status
                            )}`}
                          >
                            {berita.status || "Dipublikasi"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handlePreview(berita.id)}
                              className="p-1.5 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                              title="Lihat Detail"
                            >
                              <FaEye className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleEdit(berita.id)}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(berita.id)}
                              className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                              title="Hapus"
                            >
                              <FaTrash className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Tidak ada data berita yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-700/30 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 animate-modalFadeIn">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Tambah Berita Baru
              </h3>
              <p className="text-gray-600 text-sm">
                Masukkan informasi berita yang akan ditambahkan
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="judul"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Judul Berita
                </label>
                <input
                  id="judul"
                  type="text"
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData({ ...formData, judul: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Masukkan judul berita"
                />
              </div>

              <div>
                <label
                  htmlFor="kategori"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori
                </label>
                <select
                  id="kategori"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Umum">Umum</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Infrastruktur">Infrastruktur</option>
                  <option value="Pertanian">Pertanian</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tanggalTerbit"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tanggal
                  </label>
                  <input
                    id="tanggalTerbit"
                    type="date"
                    value={formData.tanggalTerbit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalTerbit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="penulis"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Penulis
                  </label>
                  <input
                    id="penulis"
                    type="text"
                    value={formData.penulis}
                    onChange={(e) =>
                      setFormData({ ...formData, penulis: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Nama penulis"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Dipublikasi">Dipublikasi</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="ringkasan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ringkasan
                </label>
                <textarea
                  id="ringkasan"
                  value={formData.ringkasan}
                  onChange={(e) =>
                    setFormData({ ...formData, ringkasan: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
                  placeholder="Ringkasan singkat berita"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="isi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Konten Berita
                </label>
                <textarea
                  id="isi"
                  value={formData.isi}
                  onChange={(e) =>
                    setFormData({ ...formData, isi: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[200px]"
                  placeholder="Isi konten berita lengkap"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveNewItem}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-700/30 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 animate-modalFadeIn">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Berita</h3>
              <p className="text-gray-600 text-sm">Ubah informasi berita</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="edit-judul"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Judul Berita
                </label>
                <input
                  id="edit-judul"
                  type="text"
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData({ ...formData, judul: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-kategori"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori
                </label>
                <select
                  id="edit-kategori"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Umum">Umum</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Infrastruktur">Infrastruktur</option>
                  <option value="Pertanian">Pertanian</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-tanggalTerbit"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tanggal
                  </label>
                  <input
                    id="edit-tanggalTerbit"
                    type="date"
                    value={formData.tanggalTerbit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalTerbit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-penulis"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Penulis
                  </label>
                  <input
                    id="edit-penulis"
                    type="text"
                    value={formData.penulis}
                    onChange={(e) =>
                      setFormData({ ...formData, penulis: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Dipublikasi">Dipublikasi</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-ringkasan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ringkasan
                </label>
                <textarea
                  id="edit-ringkasan"
                  value={formData.ringkasan}
                  onChange={(e) =>
                    setFormData({ ...formData, ringkasan: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="edit-isi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Konten Berita
                </label>
                <textarea
                  id="edit-isi"
                  value={formData.isi}
                  onChange={(e) =>
                    setFormData({ ...formData, isi: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[200px]"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveEditedItem}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-700/30 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200 animate-modalFadeIn">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin menghapus berita "{currentItem?.judul}"?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/40 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 animate-modalFadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                <FaNewspaper className="inline-block mr-2 text-purple-500" />
                Preview Berita
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <FaNewspaper className="text-gray-300 text-5xl" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentItem?.judul}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    currentItem?.kategori
                  )}`}
                >
                  <FaTags className="inline-block mr-1" />
                  {currentItem?.kategori || "Umum"}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <FaCalendarAlt className="inline-block mr-1" />
                  {currentItem?.tanggalTerbit &&
                    formatDate(currentItem.tanggalTerbit)}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <FaUser className="inline-block mr-1" />
                  {currentItem?.penulis}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    currentItem?.status
                  )}`}
                >
                  {currentItem?.status || "Dipublikasi"}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 mb-4">
                <p className="font-medium">Ringkasan:</p>
                <p>{currentItem?.ringkasan || "Tidak ada ringkasan"}</p>
              </div>

              <div className="text-gray-700">
                <p className="font-medium mb-2">Konten Lengkap:</p>
                {currentItem?.isi ? (
                  <div className="prose max-w-none">{currentItem.isi}</div>
                ) : (
                  <p className="text-gray-500 italic">Konten belum tersedia.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
              {currentItem?.status === "Draft" && (
                <button
                  onClick={() => publishBerita(currentItem.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <FaNewspaper className="text-white" />
                  <span>Publikasikan</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeritaAdmin;
