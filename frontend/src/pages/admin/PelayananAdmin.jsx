"use client";

import { useState, useEffect } from "react";
import {
  FaLink,
  FaPlus,
  FaEdit,
  FaTrash,
  FaIdCard,
  FaUsers,
  FaFileAlt,
  FaExternalLinkAlt,
  FaCopy,
  FaSpinner,
} from "react-icons/fa";
import PelayananServiceAdmin from "../../services/admin/PelayananServiceAdmin";
import toast from "../../components/Toast";

const PelayananAdmin = () => {
  // State untuk data
  const [layananData, setLayananData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for active tab/filter
  const [activeTab, setActiveTab] = useState("semua");

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    nama_layanan: "",
    kategori: "Dokumen Identitas",
    deskripsi: "",
    link_google_form: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchPelayananData();
  }, []);

  // Fetch pelayanan data
  const fetchPelayananData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PelayananServiceAdmin.getAllPelayanan();
      setLayananData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data pelayanan. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on active tab
  const filteredData =
    activeTab === "semua"
      ? layananData
      : layananData.filter((item) =>
          item.kategori.toLowerCase().includes(activeTab.toLowerCase())
        );

  // Count by category
  const countDokumenIdentitas = layananData.filter(
    (item) => item.kategori === "Dokumen Identitas"
  ).length;
  const countKependudukan = layananData.filter(
    (item) => item.kategori === "Kependudukan"
  ).length;
  const countPencatatanSipil = layananData.filter(
    (item) => item.kategori === "Pencatatan Sipil"
  ).length;

  // Handle actions
  const handleAdd = () => {
    setFormData({
      nama_layanan: "",
      kategori: "Dokumen Identitas",
      deskripsi: "",
      link_google_form: "",
    });
    setShowAddModal(true);
  };

  const handleEdit = (id) => {
    const item = layananData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setFormData({
        nama_layanan: item.nama_layanan,
        kategori: item.kategori,
        deskripsi: item.deskripsi,
        link_google_form: item.link_google_form,
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = (id) => {
    const item = layananData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setShowDeleteModal(true);
    }
  };

  const saveNewItem = async () => {
    try {
      // Validasi form
      if (!formData.nama_layanan || !formData.link_google_form) {
        toast.warning("Nama layanan dan link Google Form wajib diisi!");
        return;
      }

      // Send to API
      await PelayananServiceAdmin.addPelayanan(formData);

      // Refresh data
      await fetchPelayananData();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error saving pelayanan:", err);
      toast.error("Terjadi kesalahan saat menyimpan pelayanan.");
    }
  };

  const saveEditedItem = async () => {
    try {
      // Validasi form
      if (!formData.nama_layanan || !formData.link_google_form) {
        toast.warning("Nama layanan dan link Google Form wajib diisi!");
        return;
      }

      // Send to API
      await PelayananServiceAdmin.updatePelayanan(currentItem.id, formData);

      // Refresh data
      await fetchPelayananData();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating pelayanan:", err);
      toast.error("Terjadi kesalahan saat memperbarui pelayanan.");
    }
  };

  const confirmDelete = async () => {
    try {
      // Send to API
      await PelayananServiceAdmin.deletePelayanan(currentItem.id);

      // Refresh data
      await fetchPelayananData();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting pelayanan:", err);
      toast.error("Terjadi kesalahan saat menghapus pelayanan.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link berhasil disalin!");
  };

  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Dokumen Identitas":
        return <FaIdCard className="text-blue-500" />;
      case "Kependudukan":
        return <FaUsers className="text-green-500" />;
      case "Pencatatan Sipil":
        return <FaFileAlt className="text-purple-500" />;
      default:
        return <FaLink className="text-gray-500" />;
    }
  };

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ fontFamily: "poppins" }}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaLink className="text-blue-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Pelayanan
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Layanan
              </h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaLink className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {layananData.length}
            </div>
            <p className="text-sm text-gray-600">Jenis layanan tersedia</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Dokumen Identitas
              </h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaIdCard className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countDokumenIdentitas}
            </div>
            <p className="text-sm text-gray-600">Layanan identitas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Kependudukan
              </h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <FaUsers className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countKependudukan}
            </div>
            <p className="text-sm text-gray-600">Layanan kependudukan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Pencatatan Sipil
              </h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaFileAlt className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countPencatatanSipil}
            </div>
            <p className="text-sm text-gray-600">Layanan pencatatan sipil</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("semua")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "semua"
                  ? "bg-blue-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaLink
                className={
                  activeTab === "semua" ? "text-white" : "text-blue-500"
                }
              />
              <span>Semua Layanan</span>
            </button>
            <button
              onClick={() => setActiveTab("dokumen")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "dokumen"
                  ? "bg-blue-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaIdCard
                className={
                  activeTab === "dokumen" ? "text-white" : "text-blue-500"
                }
              />
              <span>Dokumen Identitas</span>
            </button>
            <button
              onClick={() => setActiveTab("kependudukan")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "kependudukan"
                  ? "bg-green-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaUsers
                className={
                  activeTab === "kependudukan" ? "text-white" : "text-green-500"
                }
              />
              <span>Kependudukan</span>
            </button>
            <button
              onClick={() => setActiveTab("pencatatan")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "pencatatan"
                  ? "bg-purple-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaFileAlt
                className={
                  activeTab === "pencatatan" ? "text-white" : "text-purple-500"
                }
              />
              <span>Pencatatan Sipil</span>
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Daftar Layanan
              </h2>
              <p className="text-gray-600 text-sm">
                Kelola layanan administrasi desa yang tersedia untuk warga
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaPlus className="text-white" />
              <span>Tambah Layanan</span>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">Memuat data layanan...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchPelayananData}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                      Nama Layanan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Link Google Form
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 rounded-tr-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {item.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {item.nama_layanan}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.deskripsi}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(item.kategori)}
                            <span>{item.kategori}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[200px]">
                              {item.link_google_form}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(item.link_google_form)
                              }
                              className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Salin Link"
                            >
                              <FaCopy className="text-gray-600 text-xs" />
                            </button>
                            <a
                              href={item.link_google_form}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                              title="Buka Link"
                            >
                              <FaExternalLinkAlt className="text-blue-600 text-xs" />
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
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
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Tidak ada data layanan yang ditemukan.
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Tambah Layanan Baru
              </h3>
              <p className="text-gray-600 text-sm">
                Masukkan informasi layanan yang akan ditambahkan
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="nama_layanan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Layanan
                </label>
                <input
                  id="nama_layanan"
                  type="text"
                  value={formData.nama_layanan}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_layanan: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama layanan"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Dokumen Identitas">Dokumen Identitas</option>
                  <option value="Kependudukan">Kependudukan</option>
                  <option value="Pencatatan Sipil">Pencatatan Sipil</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="link_google_form"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Link Google Form
                </label>
                <input
                  id="link_google_form"
                  type="text"
                  value={formData.link_google_form}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      link_google_form: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://forms.gle/example"
                />
              </div>
              <div>
                <label
                  htmlFor="deskripsi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deskripsi singkat layanan"
                  rows={3}
                />
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Layanan</h3>
              <p className="text-gray-600 text-sm">Ubah informasi layanan</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="edit-nama_layanan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Layanan
                </label>
                <input
                  id="edit-nama_layanan"
                  type="text"
                  value={formData.nama_layanan}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_layanan: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Dokumen Identitas">Dokumen Identitas</option>
                  <option value="Kependudukan">Kependudukan</option>
                  <option value="Pencatatan Sipil">Pencatatan Sipil</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="edit-link_google_form"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Link Google Form
                </label>
                <input
                  id="edit-link_google_form"
                  type="text"
                  value={formData.link_google_form}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      link_google_form: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-deskripsi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi
                </label>
                <textarea
                  id="edit-deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin menghapus layanan "
                {currentItem?.nama_layanan}"? Tindakan ini tidak dapat
                dibatalkan.
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
    </div>
  );
};

export default PelayananAdmin;
