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
  FaCheck,
  FaTimesCircle,
  FaImage,
  FaExchangeAlt,
  FaTrashAlt,
} from "react-icons/fa";
import BeritaServiceAdmin from "../services/BeritaServiceAdmin";
import toast from "../../../components/Toast";

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

  // State for action loading
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    judul: "",
    tanggalTerbit: "",
    penulis: "",
    status: "Draft",
    ringkasan: "",
    isi: "",
    foto: null,
    fotoPreview: null,
    deleteFoto: false,
    originalFoto: null,
  });

  // Definisi animasi CSS
  useEffect(() => {
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

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
        tanggalTerbit: item.tanggalTerbit,
        penulis: item.penulis,
        status: item.status || "Dipublikasi", // Default to "Dipublikasi" if not provided
        ringkasan: item.ringkasan || item.isi?.substring(0, 150) || "", // Use first 150 chars of isi as ringkasan if not provided
        isi: item.isi,
        foto: item.foto,
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
      tanggalTerbit: new Date().toISOString().split("T")[0],
      penulis: "Admin",
      status: "Draft",
      ringkasan: "",
      isi: "",
      foto: null,
      fotoPreview: null,
      deleteFoto: false,
      originalFoto: null,
    });
    setShowAddModal(true);
  };

  const handleEdit = (id) => {
    const item = beritaData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);

      // Ensure tanggalTerbit is in the correct format for date input
      let formattedDate = item.tanggalTerbit;
      if (formattedDate) {
        try {
          const date = new Date(formattedDate);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split("T")[0];
          }
        } catch (e) {
          console.error("Error formatting date:", e);
          formattedDate = new Date().toISOString().split("T")[0];
        }
      } else {
        formattedDate = new Date().toISOString().split("T")[0];
      }

      setFormData({
        judul: item.judul || "",
        tanggalTerbit: formattedDate,
        penulis: item.penulis || "",
        status: item.status || "Draft",
        ringkasan: item.ringkasan || "",
        isi: item.isi || "",
        foto: null,
        fotoPreview: item.foto
          ? BeritaServiceAdmin.getImageUrl(item.foto)
          : null,
        deleteFoto: false,
        originalFoto: item.foto,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
        deleteFoto: false,
      });
    }
  };

  const handleChangeThumbnail = () => {
    // Trigger file input click
    document.getElementById("thumbnail-file-input").click();
  };

  const handleDeleteThumbnail = () => {
    setFormData({
      ...formData,
      foto: null,
      fotoPreview: null,
      deleteFoto: true,
    });
  };

  const saveNewItem = async () => {
    if (!token) {
      toast.info("Anda harus login sebagai admin untuk menambahkan berita");
      return;
    }

    try {
      setIsActionLoading(true);

      // Validasi form
      if (
        !formData.judul ||
        !formData.isi ||
        !formData.tanggalTerbit ||
        !formData.penulis
      ) {
        toast.info("Judul, isi, tanggal terbit, dan penulis wajib diisi!");
        setIsActionLoading(false);
        return;
      }

      // Prepare data for API
      const beritaData = {
        judul: formData.judul,
        isi: formData.isi,
        tanggalTerbit: formData.tanggalTerbit,
        penulis: formData.penulis,
        status: formData.status,
        ringkasan: formData.ringkasan,
        foto: formData.foto,
      };

      // Send to API
      const result = await BeritaServiceAdmin.addBerita(beritaData);

      // Refresh data
      await fetchBeritaData();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error saving berita:", err);
      toast.error("Terjadi kesalahan saat menyimpan berita.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const saveEditedItem = async () => {
    if (!token) {
      toast.warning("Anda harus login sebagai admin untuk mengedit berita");
      return;
    }

    try {
      setIsActionLoading(true);

      // Validasi form
      if (
        !formData.judul ||
        !formData.isi ||
        !formData.tanggalTerbit ||
        !formData.penulis
      ) {
        toast.info("Judul, isi, tanggal terbit, dan penulis wajib diisi!");
        setIsActionLoading(false);
        return;
      }

      // Prepare data for API
      const beritaData = {
        judul: formData.judul,
        isi: formData.isi,
        tanggalTerbit: formData.tanggalTerbit,
        penulis: formData.penulis,
        status: formData.status,
        ringkasan: formData.ringkasan,
        foto: formData.foto,
        deleteFoto: formData.deleteFoto,
      };

      // Send to API
      await BeritaServiceAdmin.updateBerita(currentItem.id, beritaData);

      // Refresh data
      await fetchBeritaData();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating berita:", err);
      toast.error("Terjadi kesalahan saat memperbarui berita.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!token) {
      toast.warning("Anda harus login sebagai admin untuk menghapus berita");
      return;
    }

    try {
      setIsActionLoading(true);

      // Send to API
      await BeritaServiceAdmin.deleteBerita(currentItem.id);

      // Refresh data
      await fetchBeritaData();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting berita:", err);
      toast.error("Terjadi kesalahan saat menghapus berita.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const togglePublishStatus = async (id) => {
    if (!token) {
      toast.warning(
        "Anda harus login sebagai admin untuk mengubah status berita"
      );
      return;
    }

    try {
      const item = beritaData.find((item) => item.id === id);
      if (!item) return;

      // Toggle status
      const newStatus = item.status === "Dipublikasi" ? "Draft" : "Dipublikasi";

      // Update status in backend first
      await BeritaServiceAdmin.updateBeritaStatus(id, newStatus);

      // If successful, update in our state
      const updatedData = beritaData.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      );

      setBeritaData(updatedData);

      // If preview modal is open and showing this item, update it there too
      if (showPreviewModal && currentItem && currentItem.id === id) {
        setCurrentItem({ ...currentItem, status: newStatus });
      }

      // Show success message
      toast.success(
        `Berita berhasil ${
          newStatus === "Dipublikasi" ? "dipublikasikan" : "diubah ke draft"
        }`
      );
    } catch (err) {
      console.error("Error toggling publish status:", err);
      toast.error("Terjadi kesalahan saat mengubah status publikasi berita.");
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
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ fontFamily: "poppins" }}
    >
      <div className="w-full mx-auto">
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
                      Thumbnail
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
                          {berita.foto ? (
                            <img
                              src={
                                BeritaServiceAdmin.getImageUrl(berita.foto) ||
                                "/placeholder.svg"
                              }
                              alt={berita.judul}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
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
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                berita.status
                              )}`}
                            >
                              {berita.status || "Dipublikasi"}
                            </span>
                            {/* Tombol toggle status */}
                            <button
                              onClick={() => togglePublishStatus(berita.id)}
                              className={`p-1 rounded-full ${
                                berita.status === "Dipublikasi"
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                              title={
                                berita.status === "Dipublikasi"
                                  ? "Ubah ke Draft"
                                  : "Publikasikan"
                              }
                            >
                              {berita.status === "Dipublikasi" ? (
                                <FaTimesCircle className="text-xs" />
                              ) : (
                                <FaCheck className="text-xs" />
                              )}
                            </button>
                          </div>
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
                        colSpan={7}
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
                  htmlFor="foto"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thumbnail Berita
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {formData.fotoPreview && (
                    <div className="relative w-16 h-16">
                      <img
                        src={formData.fotoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            foto: null,
                            fotoPreview: null,
                          })
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
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
                disabled={isActionLoading}
              >
                Batal
              </button>
              <button
                onClick={saveNewItem}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan</span>
                )}
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
                  htmlFor="edit-foto"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thumbnail Berita
                </label>
                <div className="flex flex-col gap-3">
                  {/* Thumbnail preview */}
                  {formData.fotoPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 relative">
                        <img
                          src={formData.fotoPreview || "/placeholder.svg"}
                          alt="Thumbnail"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={handleChangeThumbnail}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                          <FaExchangeAlt size={14} />
                          <span>Ganti Thumbnail</span>
                        </button>
                        {/* <button
                          type="button"
                          onClick={handleDeleteThumbnail}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          <FaTrashAlt size={14} />
                          <span>Hapus Thumbnail</span>
                        </button> */}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                        <FaImage className="text-gray-400 text-2xl" />
                      </div>
                      <button
                        type="button"
                        onClick={handleChangeThumbnail}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        <FaPlus size={14} />
                        <span>Tambah Thumbnail</span>
                      </button>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    id="thumbnail-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
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
                disabled={isActionLoading}
              >
                Batal
              </button>
              <button
                onClick={saveEditedItem}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
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
                disabled={isActionLoading}
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Hapus</span>
                )}
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
              {currentItem?.foto ? (
                <img
                  src={
                    BeritaServiceAdmin.getImageUrl(currentItem.foto) ||
                    "/placeholder.svg"
                  }
                  alt={currentItem.judul}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <FaNewspaper className="text-gray-300 text-5xl" />
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentItem?.judul}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
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
              {currentItem?.status === "Draft" ? (
                <button
                  onClick={() => togglePublishStatus(currentItem.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FaNewspaper className="text-white" />
                      <span>Publikasikan</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => togglePublishStatus(currentItem.id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-white" />
                      <span>Ubah ke Draft</span>
                    </>
                  )}
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
