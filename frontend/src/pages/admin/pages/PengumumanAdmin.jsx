"use client";

import { useState, useEffect } from "react";
import {
  FaBullhorn,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaCheck,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import PengumumanServiceAdmin from "../services/PengumumanServiceAdmin";
import toast from "../../../components/Toast";

const PengumumanAdmin = () => {
  // State for data
  const [pengumumanData, setPengumumanData] = useState([]);
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
    isi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
  });

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch data methods
  const fetchAllPengumuman = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PengumumanServiceAdmin.getAllPengumuman();

      // Transform data to match our component's expected format
      const transformedData = data.map((item) => ({
        id: item.id,
        judul: item.judul,
        isi: item.isi,
        tanggalMulai: item.tanggalMulai
          ? new Date(item.tanggalMulai).toISOString()
          : null,
        tanggalSelesai: item.tanggalSelesai
          ? new Date(item.tanggalSelesai).toISOString()
          : null,
        status:
          new Date(item.tanggalSelesai) < new Date() ? "Kadaluarsa" : "Aktif",
      }));

      setPengumumanData(transformedData);
    } catch (err) {
      console.error("Error in fetchAllPengumuman:", err);
      setError("Gagal memuat data pengumuman.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllPengumuman();
  }, []);

  // Filter data based on active tab and search query
  const filteredData = pengumumanData.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeTab === "semua" ||
      (activeTab === "aktif" && item.status === "Aktif") ||
      (activeTab === "kadaluarsa" && item.status === "Kadaluarsa");

    return matchesSearch && matchesFilter;
  });

  // Count by status
  const countAktif = pengumumanData.filter(
    (item) => item.status === "Aktif"
  ).length;
  const countKadaluarsa = pengumumanData.filter(
    (item) => item.status === "Kadaluarsa"
  ).length;

  // Handle actions
  const handleAdd = () => {
    setFormData({
      judul: "",
      isi: "",
      tanggalMulai: new Date().toISOString().split("T")[0],
      tanggalSelesai: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .split("T")[0],
      status: "Aktif",
    });
    setShowAddModal(true);
  };

  const handleEdit = (id) => {
    const item = pengumumanData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setFormData({
        judul: item.judul,
        isi: item.isi,
        tanggalMulai: item.tanggalMulai
          ? new Date(item.tanggalMulai).toISOString().split("T")[0]
          : "",
        tanggalSelesai: item.tanggalSelesai
          ? new Date(item.tanggalSelesai).toISOString().split("T")[0]
          : "",
        // Include UI fields
        status: item.status,
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = (id) => {
    const item = pengumumanData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setShowDeleteModal(true);
    }
  };

  const handlePreview = (id) => {
    const item = pengumumanData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setShowPreviewModal(true);
    }
  };

  const saveNewItem = async () => {
    if (!token) {
      toast.warning(
        "Anda harus login sebagai admin untuk menambahkan pengumuman"
      );
      return;
    }

    try {
      // Validasi form
      if (
        !formData.judul ||
        !formData.isi ||
        !formData.tanggalMulai ||
        !formData.tanggalSelesai
      ) {
        toast.warning("Semua data wajib diisi!");
        return;
      }

      // Call API
      await PengumumanServiceAdmin.addPengumuman(formData);

      // Refresh data
      await fetchAllPengumuman();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error(
        err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan pengumuman."
      );
    }
  };

  const saveEditedItem = async () => {
    if (!token) {
      toast.warning("Anda harus login sebagai admin untuk mengedit pengumuman");
      return;
    }

    try {
      // Call API
      await PengumumanServiceAdmin.updatePengumuman(currentItem.id, formData);

      // Refresh data
      await fetchAllPengumuman();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating data:", err);
      toast.error(
        err.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui pengumuman."
      );
    }
  };

  const confirmDelete = async () => {
    if (!token) {
      toast.warning(
        "Anda harus login sebagai admin untuk menghapus pengumuman"
      );
      return;
    }

    try {
      // Call API
      await PengumumanServiceAdmin.deletePengumuman(currentItem.id);

      // Refresh data
      await fetchAllPengumuman();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting data:", err);
      toast.error(
        err.response?.data?.message ||
          "Terjadi kesalahan saat menghapus pengumuman."
      );
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800";
      case "Kadaluarsa":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle reactivating an expired announcement
  const handleReactivate = async (id) => {
    if (!token) {
      toast.warning(
        "Anda harus login sebagai admin untuk mengaktifkan pengumuman"
      );
      return;
    }

    try {
      const item = pengumumanData.find((item) => item.id === id);
      if (!item) return;

      // Set new end date to 7 days from now
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + 7);

      const updateData = {
        judul: item.judul,
        isi: item.isi,
        tanggalMulai: new Date().toISOString().split("T")[0],
        tanggalSelesai: newEndDate.toISOString().split("T")[0],
      };

      await PengumumanServiceAdmin.updatePengumuman(id, updateData);
      await fetchAllPengumuman();
      setShowPreviewModal(false);
    } catch (err) {
      console.error("Error reactivating announcement:", err);
      toast.error("Terjadi kesalahan saat mengaktifkan kembali pengumuman.");
    }
  };

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ fontFamily: "poppins" }}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FaBullhorn className="text-purple-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Pengumuman
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Pengumuman
              </h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaBullhorn className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {pengumumanData.length}
            </div>
            <p className="text-sm text-gray-600">Pengumuman tersimpan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Pengumuman Aktif
              </h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <FaCheck className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countAktif}
            </div>
            <p className="text-sm text-gray-600">Pengumuman aktif</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Pengumuman Kadaluarsa
              </h3>
              <div className="bg-gray-100 p-2 rounded-lg">
                <FaClock className="text-gray-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countKadaluarsa}
            </div>
            <p className="text-sm text-gray-600">Pengumuman kadaluarsa</p>
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
              <FaBullhorn
                className={
                  activeTab === "semua" ? "text-white" : "text-purple-500"
                }
              />
              <span>Semua Pengumuman</span>
            </button>
            <button
              onClick={() => setActiveTab("aktif")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "aktif"
                  ? "bg-green-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaCheck
                className={
                  activeTab === "aktif" ? "text-white" : "text-green-500"
                }
              />
              <span>Aktif</span>
            </button>
            <button
              onClick={() => setActiveTab("kadaluarsa")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "kadaluarsa"
                  ? "bg-gray-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaClock
                className={
                  activeTab === "kadaluarsa" ? "text-white" : "text-gray-500"
                }
              />
              <span>Kadaluarsa</span>
            </button>
          </div>
        </div>

        {/* Pengumuman Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Daftar Pengumuman
              </h2>
              <p className="text-gray-600 text-sm">
                Kelola pengumuman dan informasi penting
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pengumuman..."
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
                <span>Tambah Pengumuman</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-4xl text-purple-500 mx-auto mb-4" />
              <p className="mt-2 text-gray-600">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchAllPengumuman}
                className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Tanggal Mulai
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Tanggal Selesai
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
                    filteredData.map((pengumuman) => (
                      <tr key={pengumuman.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {pengumuman.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {pengumuman.judul}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            {new Date(
                              pengumuman.tanggalMulai
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            {new Date(
                              pengumuman.tanggalSelesai
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              pengumuman.status
                            )}`}
                          >
                            {pengumuman.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handlePreview(pengumuman.id)}
                              className="p-1.5 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                              title="Lihat Detail"
                            >
                              <FaEye className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleEdit(pengumuman.id)}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(pengumuman.id)}
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
                        colSpan={7}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Tidak ada data pengumuman yang ditemukan.
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
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Tambah Pengumuman Baru
              </h3>
              <p className="text-gray-600 text-sm">
                Masukkan informasi pengumuman yang akan ditambahkan
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="judul"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Judul Pengumuman
                </label>
                <input
                  id="judul"
                  type="text"
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData({ ...formData, judul: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Masukkan judul pengumuman"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tanggalMulai"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tanggal Mulai
                  </label>
                  <input
                    id="tanggalMulai"
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggalMulai: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tanggalSelesai"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tanggal Berakhir
                  </label>
                  <input
                    id="tanggalSelesai"
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalSelesai: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="isi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Isi Pengumuman
                </label>
                <textarea
                  id="isi"
                  value={formData.isi}
                  onChange={(e) =>
                    setFormData({ ...formData, isi: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[150px]"
                  placeholder="Isi pengumuman lengkap"
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
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Edit Pengumuman
              </h3>
              <p className="text-gray-600 text-sm">Ubah informasi pengumuman</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="edit-judul"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Judul Pengumuman
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-tanggalMulai"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tanggal Mulai
                  </label>
                  <input
                    id="edit-tanggalMulai"
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggalMulai: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-tanggalSelesai"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tanggal Berakhir
                  </label>
                  <input
                    id="edit-tanggalSelesai"
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalSelesai: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-isi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Isi Pengumuman
                </label>
                <textarea
                  id="edit-isi"
                  value={formData.isi}
                  onChange={(e) =>
                    setFormData({ ...formData, isi: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[150px]"
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
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin menghapus pengumuman "
                {currentItem?.judul}"? Tindakan ini tidak dapat dibatalkan.
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
        <div className="fixed inset-0 backdrop-blur bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                <FaBullhorn className="inline-block mr-2 text-purple-500" />
                Detail Pengumuman
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
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentItem?.judul}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Tanggal Mulai</p>
                    <p className="font-medium flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      {currentItem?.tanggal &&
                        new Date(currentItem.tanggal).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal Berakhir</p>
                    <p className="font-medium flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      {currentItem?.tanggalBerakhir &&
                        new Date(
                          currentItem.tanggalBerakhir
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Isi Pengumuman
                </h4>
                <div className="text-gray-700 whitespace-pre-line">
                  {currentItem?.isi}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
              {currentItem?.status === "Kadaluarsa" && (
                <button
                  onClick={() => handleReactivate(currentItem.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <FaCheck className="text-white" />
                  <span>Aktifkan Kembali</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengumumanAdmin;
