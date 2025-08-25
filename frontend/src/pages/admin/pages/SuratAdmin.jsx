"use client";

import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaDownload,
  FaSpinner,
  FaFilePdf,
  FaExclamationTriangle,
} from "react-icons/fa";
import SuratService from "../services/SuratServiceAdmin";
import SuratForm from "../components/SuratForm";
import toast from "../../../components/Toast";

function SuratAdmin() {
  const [suratData, setSuratData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("semua");

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // PDF viewer state
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

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

  // Fetch data methods
  const fetchAllSurat = async () => {
    setIsLoading(true);
    setError(null);
    try {
      ("Fetching all surat...");
      const data = await SuratService.getAllSurat();
      "Fetched data:", data;
      setSuratData(data);
    } catch (err) {
      console.error("Error in fetchAllSurat:", err);
      setError("Gagal memuat data surat.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuratMasuk = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SuratService.getSuratMasuk();
      setSuratData(data);
    } catch (err) {
      setError("Gagal memuat data surat masuk.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuratKeluar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SuratService.getSuratKeluar();
      setSuratData(data);
    } catch (err) {
      setError("Gagal memuat data surat keluar.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab changes and fetch appropriate data
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "semua") {
      fetchAllSurat();
    } else if (tab === "masuk") {
      fetchSuratMasuk();
    } else if (tab === "keluar") {
      fetchSuratKeluar();
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllSurat();
  }, []);

  // Filter data based on search query
  const filteredData = suratData.filter((item) => {
    const matchesSearch =
      (item.perihal?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.nomor?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.pengirim?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Count by type
  const countMasuk = suratData.filter(
    (item) => item.jenis === "Surat Masuk"
  ).length;
  const countKeluar = suratData.filter(
    (item) => item.jenis === "Surat Keluar"
  ).length;

  // Form state
  const [formData, setFormData] = useState({
    jenis: "Surat Masuk",
    nomor: "",
    perihal: "",
    pengirim: "",
    tanggal: "",
    status: "Diterima",
    file: null,
  });

  // Handle actions
  const handleAdd = () => {
    setFormData({
      jenis: "Surat Masuk",
      nomor: "",
      perihal: "",
      pengirim: "",
      tanggal: new Date().toISOString().split("T")[0],
      status: "Diterima",
      file: null,
    });
    setShowAddModal(true);
  };

  const handleEdit = (id) => {
    const item = suratData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setFormData({
        jenis: item.jenis,
        nomor: item.nomor,
        perihal: item.perihal,
        pengirim: item.pengirim,
        tanggal: item.tanggal
          ? new Date(item.tanggal).toISOString().split("T")[0]
          : "",
        status:
          item.status ||
          (item.jenis === "Surat Masuk" ? "Diterima" : "Terkirim"),
        file: null,
        fileUrl: item.file,
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = (id) => {
    const item = suratData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setShowDeleteModal(true);
    }
  };

  const handlePreview = async (id) => {
    setPdfLoading(true);
    setPdfError(false);
    setPdfUrl(null);

    const item = suratData.find((item) => item.id === id);
    if (item) {
      "Preview item:", item;

      try {
        if (item.file) {
          // Get the file URL
          const fileUrl = SuratService.getFileUrl(item.file);
          "File URL for preview:", fileUrl;

          // Check if file exists
          const fileExists = await SuratService.checkFileExists(item.file);

          if (fileExists) {
            setPdfUrl(fileUrl);
            setPdfError(false);
          } else {
            console.error("File not found or inaccessible:", fileUrl);
            setPdfError(true);
          }
        } else {
          ("No file attached to this item");
          setPdfError(true);
        }
      } catch (error) {
        console.error("Error preparing file for preview:", error);
        setPdfError(true);
      } finally {
        setPdfLoading(false);
      }

      setCurrentItem(item);
      setShowPreviewModal(true);
    }
  };

  // Handle file download
  const handleDownload = async (fileName) => {
    if (!fileName) {
      toast.info("File tidak tersedia untuk diunduh");
      return;
    }

    try {
      const success = await SuratService.downloadFile(fileName);
      if (!success) {
        toast.error("Terjadi kesalahan saat mengunduh file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Terjadi kesalahan saat mengunduh file");
    }
  };

  // API calls for CRUD operations
  const saveNewItem = async () => {
    if (!token) {
      toast.warning("Anda harus login sebagai admin untuk menambahkan surat");
      return;
    }

    try {
      setIsActionLoading(true);

      // Validasi form
      if (
        !formData.nomor ||
        !formData.perihal ||
        !formData.tanggal ||
        !formData.pengirim ||
        !formData.jenis
      ) {
        toast.warning(
          "Nomor surat, perihal, tanggal, pengirim/penerima, dan jenis surat wajib diisi!"
        );
        setIsActionLoading(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("nomorSurat", formData.nomor);
      formDataObj.append("perihal", formData.perihal);

      if (formData.file) {
        formDataObj.append("file", formData.file);
      }

      let result;
      if (formData.jenis === "Surat Masuk") {
        formDataObj.append("pengirim", formData.pengirim);
        formDataObj.append("tanggalTerima", formData.tanggal);
        result = await SuratService.addSuratMasuk(formDataObj);
      } else {
        formDataObj.append("penerima", formData.pengirim); // UI field pengirim digunakan untuk penerima
        formDataObj.append("tanggalKirim", formData.tanggal);
        result = await SuratService.addSuratKeluar(formDataObj);
      }

      // Refresh data based on current active tab
      if (activeTab === "semua") {
        await fetchAllSurat();
      } else if (activeTab === "masuk" && formData.jenis === "Surat Masuk") {
        await fetchSuratMasuk();
      } else if (activeTab === "keluar" && formData.jenis === "Surat Keluar") {
        await fetchSuratKeluar();
      } else {
        await fetchAllSurat();
      }

      setShowAddModal(false);
      toast.success("Surat berhasil ditambahkan");
    } catch (err) {
      console.error("Error saving data:", err);
      toast.info(
        "Terjadi kesalahan saat menyimpan surat. silahkan coba login kembalu"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const saveEditedItem = async () => {
    if (!token) {
      toast.console.warning();
      ("Anda harus login sebagai admin untuk mengedit surat");
      return;
    }

    try {
      setIsActionLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("nomorSurat", formData.nomor);
      formDataObj.append("perihal", formData.perihal);

      if (formData.file) {
        formDataObj.append("file", formData.file);
      }

      if (formData.jenis === "Surat Masuk") {
        formDataObj.append("pengirim", formData.pengirim);
        formDataObj.append("tanggalTerima", formData.tanggal);
        await SuratService.updateSuratMasuk(currentItem.id, formDataObj);
      } else {
        formDataObj.append("penerima", formData.pengirim);
        formDataObj.append("tanggalKirim", formData.tanggal);
        await SuratService.updateSuratKeluar(currentItem.id, formDataObj);
      }

      // Refresh data based on current active tab
      if (activeTab === "semua") {
        await fetchAllSurat();
      } else if (activeTab === "masuk" && formData.jenis === "Surat Masuk") {
        await fetchSuratMasuk();
      } else if (activeTab === "keluar" && formData.jenis === "Surat Keluar") {
        await fetchSuratKeluar();
      } else {
        await fetchAllSurat();
      }

      setShowEditModal(false);
      toast.success("Surat berhasil diperbarui");
    } catch (err) {
      console.error("Error updating data:", err);
      toast.error("Terjadi kesalahan saat memperbarui");
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!token) {
      toast.warning("Anda harus login sebagai admin untuk menghapus surat");
      return;
    }

    try {
      setIsActionLoading(true);

      if (currentItem.jenis === "Surat Masuk") {
        await SuratService.deleteSuratMasuk(currentItem.id);
      } else {
        await SuratService.deleteSuratKeluar(currentItem.id);
      }

      // Refresh data based on current active tab
      if (activeTab === "semua") {
        await fetchAllSurat();
      } else if (activeTab === "masuk" && currentItem.jenis === "Surat Masuk") {
        await fetchSuratMasuk();
      } else if (
        activeTab === "keluar" &&
        currentItem.jenis === "Surat Keluar"
      ) {
        await fetchSuratKeluar();
      } else {
        await fetchAllSurat();
      }

      setShowDeleteModal(false);
      toast.success("Surat berhasil dihapus");
    } catch (err) {
      console.error("Error deleting data:", err);
      toast.error("Terjadi kesalahan saat menghapus");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Get icon and color based on surat type
  const getSuratIcon = (type) => {
    if (type === "Surat Masuk") {
      return <FaEnvelopeOpen className="text-blue-500" />;
    } else {
      return <FaEnvelope className="text-green-500" />;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Diterima":
        return "bg-green-100 text-green-800";
      case "Terkirim":
        return "bg-blue-100 text-blue-800";
      case "Diproses":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FaFileAlt className="text-purple-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Surat</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Surat
              </h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaFileAlt className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {suratData.length}
            </div>
            <p className="text-sm text-gray-600">Surat tersimpan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Surat Masuk
              </h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaEnvelopeOpen className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countMasuk}
            </div>
            <p className="text-sm text-gray-600">Surat masuk tersimpan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Surat Keluar
              </h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <FaEnvelope className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {countKeluar}
            </div>
            <p className="text-sm text-gray-600">Surat keluar tersimpan</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTabChange("semua")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "semua"
                  ? "bg-purple-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaFileAlt
                className={
                  activeTab === "semua" ? "text-white" : "text-purple-500"
                }
              />
              <span>Semua Surat</span>
            </button>
            <button
              onClick={() => handleTabChange("masuk")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "masuk"
                  ? "bg-blue-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaEnvelopeOpen
                className={
                  activeTab === "masuk" ? "text-white" : "text-blue-500"
                }
              />
              <span>Surat Masuk</span>
            </button>
            <button
              onClick={() => handleTabChange("keluar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "keluar"
                  ? "bg-green-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaEnvelope
                className={
                  activeTab === "keluar" ? "text-white" : "text-green-500"
                }
              />
              <span>Surat Keluar</span>
            </button>
          </div>
        </div>

        {/* Surat Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Daftar Surat</h2>
              <p className="text-gray-600 text-sm">
                Kelola surat masuk dan keluar di sistem
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari surat..."
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
                <span>Tambah Surat</span>
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
                onClick={() => handleTabChange(activeTab)}
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
                      No. Surat
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Perihal
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Pengirim/Penerima
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Tanggal
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
                    filteredData.map((surat, index) => (
                      <tr key={surat.id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {surat.nomor}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            {getSuratIcon(surat.jenis)}
                            <span>{surat.jenis}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {surat.perihal}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {surat.pengirim}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {new Date(surat.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              surat.status
                            )}`}
                          >
                            {surat.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handlePreview(surat.id)}
                              className="p-1.5 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                              title="Lihat Detail"
                            >
                              <FaEye className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleEdit(surat.id)}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(surat.id)}
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
                        Tidak ada data surat yang ditemukan.
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
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200 animate-modalFadeIn">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Tambah Surat Baru
              </h3>
              <p className="text-gray-600 text-sm">
                Masukkan informasi surat yang akan ditambahkan
              </p>
            </div>

            <SuratForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={saveNewItem}
              onCancel={() => setShowAddModal(false)}
              isEdit={false}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-700/30 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200 animate-modalFadeIn">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Surat</h3>
              <p className="text-gray-600 text-sm">Ubah informasi surat</p>
            </div>

            <SuratForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={saveEditedItem}
              onCancel={() => setShowEditModal(false)}
              isEdit={true}
              currentItem={currentItem}
            />
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
                Apakah Anda yakin ingin menghapus surat "{currentItem?.nomor}"?
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
      {showPreviewModal && currentItem && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-700/30 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200 animate-modalFadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {getSuratIcon(currentItem?.jenis)} {currentItem?.perihal}
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

            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Nomor Surat</p>
                  <p className="font-medium">{currentItem?.nomor}</p>
                </div>
                <div>
                  <p className="text-gray-500">Jenis</p>
                  <p className="font-medium">{currentItem?.jenis}</p>
                </div>
                <div>
                  <p className="text-gray-500">
                    {currentItem?.jenis === "Surat Masuk"
                      ? "Pengirim"
                      : "Penerima"}
                  </p>
                  <p className="font-medium">{currentItem?.pengirim}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tanggal</p>
                  <p className="font-medium">
                    {new Date(currentItem?.tanggal).toLocaleDateString(
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
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        currentItem?.status
                      )}`}
                    >
                      {currentItem?.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Dokumen Surat
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 max-w-full overflow-hidden">
                {pdfLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-4xl text-purple-500 mb-4" />
                    <p className="text-center">Memuat dokumen...</p>
                  </div>
                ) : currentItem.file && pdfUrl ? (
                  <div className="flex flex-col gap-4 min-w-0">
                    <div className="flex items-center justify-between gap-3 min-w-0">
                      {/* File name section with text truncation */}
                      <div className="flex items-center min-w-0 flex-1">
                        <FaFilePdf className="flex-shrink-0 mr-2 text-red-500" />
                        <p 
                          className="font-medium truncate min-w-0"
                          title={currentItem.file.split("/").pop() || "Dokumen Surat"}
                        >
                          {currentItem.file.split("/").pop() || "Dokumen Surat"}
                        </p>
                      </div>
                      
                      {/* Download button */}
                      <button
                        onClick={() => handleDownload(currentItem.file)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 flex-shrink-0 text-sm"
                      >
                        <FaDownload className="text-white w-3 h-3" />
                        <span className="hidden sm:inline">Unduh</span>
                      </button>
                    </div>

                    {/* PDF Viewer */}
                    <div className="w-full h-[400px] border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <iframe
                        src={pdfUrl}
                        className="w-full h-full"
                        title={`Preview ${currentItem.nomor}`}
                      ></iframe>
                    </div>
                  </div>
                ) : pdfError ? (
                  <div className="flex flex-col items-center justify-center py-8 text-red-500 text-center">
                    <FaExclamationTriangle className="text-4xl mb-4" />
                    <p className="px-2">Terjadi kesalahan saat memuat dokumen.</p>
                    <p className="text-sm mt-2 px-2">
                      File mungkin tidak tersedia atau tidak dapat diakses.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FaFileAlt className="text-4xl mb-4" />
                    <p className="text-gray-500 px-2">
                      Dokumen surat tidak tersedia.
                    </p>
                  </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuratAdmin;
