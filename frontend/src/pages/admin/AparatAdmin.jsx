"use client";

import { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaIdCard,
  FaPhone,
  FaSpinner,
  FaImage,
  FaPlus,
  FaExchangeAlt,
  FaTrashAlt,
} from "react-icons/fa";
import AparatServiceAdmin from "../../services/admin/AparatServiceAdmin";
import toast from "../../components/Toast";

const AparatAdmin = () => {
  // State untuk data
  const [aparatData, setAparatData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // State for search
  const [searchQuery, setSearchQuery] = useState("");

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // State for action loading
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    nip: "",
    foto: null,
    fotoPreview: null,
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
    fetchAparatData();
  }, []);

  // Fetch aparat data
  const fetchAparatData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AparatServiceAdmin.getAllAparat();

      // Format data menggunakan service
      const formattedData = AparatServiceAdmin.formatAparatData(data);

      setAparatData(formattedData);
    } catch (err) {
      console.error("Error fetching aparat data:", err);
      setError("Gagal memuat data aparat desa.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on search query
  const filteredData = aparatData.filter((item) => {
    const matchesSearch =
      (item.nama?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.jabatan?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.nip?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Handle actions
  const handleAdd = () => {
    setFormData({
      nama: "",
      jabatan: "",
      nip: "",
      foto: null,
      fotoPreview: null,
      originalFoto: null,
    });
    setShowAddModal(true);
  };

  const handleEdit = (id) => {
    const item = aparatData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);

      setFormData({
        nama: item.nama || "",
        jabatan: item.jabatan || "",
        nip: item.nip || "",
        foto: null,
        fotoPreview: item.foto || null,
        originalFoto: item.foto,
      });

      setShowEditModal(true);
    }
  };

  const handleDelete = (id) => {
    const item = aparatData.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setShowDeleteModal(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
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
    });
  };

  const saveNewItem = async () => {
    if (!token) {
      toast.info("Anda harus login sebagai admin untuk menambahkan aparat");
      return;
    }

    try {
      setIsActionLoading(true);

      // Validasi form
      if (!formData.nama || !formData.jabatan) {
        toast.info("Nama, dan jabatan wajib diisi!");
        setIsActionLoading(false);
        return;
      }

      // Prepare data for API
      const aparatData = {
        nama: formData.nama,
        jabatan: formData.jabatan,
        nip: formData.nip ? formData.nip.trim() : "",
        foto: formData.foto,
      };

      // Send to API
      const result = await AparatServiceAdmin.addAparat(aparatData);

      // Refresh data
      await fetchAparatData();
      setShowAddModal(false);
      toast.success("Aparat berhasil ditambahkan");
    } catch (err) {
      console.error("Error saving aparat:", err);
      toast.error("Terjadi kesalahan saat menyimpan aparat.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const saveEditedItem = async () => {
    if (!token) {
      toast.warning("Anda harus login sebagai admin untuk mengedit aparat");
      return;
    }

    try {
      setIsActionLoading(true);

      // Validasi form
      if (!formData.nama || !formData.jabatan) {
        toast.info("Nama, dan jabatan wajib diisi!");
        setIsActionLoading(false);
        return;
      }

      // Prepare data for API
      const aparatData = {
        nama: formData.nama,
        jabatan: formData.jabatan,
        nip: formData.nip ? formData.nip.trim() : "",
        foto: formData.foto,
      };

      // Send to API
      await AparatServiceAdmin.updateAparat(currentItem.id, aparatData);

      // Refresh data
      await fetchAparatData();
      setShowEditModal(false);
      toast.success("Aparat berhasil diperbarui");
    } catch (err) {
      console.error("Error updating aparat:", err);
      toast.error("Terjadi kesalahan saat memperbarui aparat.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!token) {
      toast.warning("Anda harus login sebagai admin untuk menghapus aparat");
      return;
    }

    try {
      setIsActionLoading(true);

      // Send to API
      await AparatServiceAdmin.deleteAparat(currentItem.id);

      // Refresh data
      await fetchAparatData();
      setShowDeleteModal(false);
      toast.success("Aparat berhasil dihapus");
    } catch (err) {
      console.error("Error deleting aparat:", err);
      toast.error("Terjadi kesalahan saat menghapus aparat.");
    } finally {
      setIsActionLoading(false);
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
            <FaUser className="text-blue-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Aparat Desa
          </h1>
        </div>

        {/* Aparat Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Daftar Aparat Desa
              </h2>
              <p className="text-gray-600 text-sm">
                Kelola data aparat dan pejabat desa
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari aparat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaPlus className="text-white" />
                <span>Tambah Aparat</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">Memuat data aparat...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchAparatData}
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
                      Foto
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Jabatan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      NIP
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 rounded-tr-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((aparat) => (
                      <tr key={aparat.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          {aparat.foto ? (
                            <img
                              src={aparat.foto || "/placeholder.svg"}
                              alt={aparat.nama}
                              className="w-12 h-12 object-cover rounded-full border-2 border-gray-200"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            {aparat.nama}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {aparat.jabatan}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <span>
                              {aparat.nip ? (
                                <div className="flex items-center gap-2">
                                  <FaIdCard className="text-gray-400" />
                                  <span>{aparat.nip}</span>
                                </div>
                              ) : (
                                "Tidak Memiliki NIP"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(aparat.id)}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(aparat.id)}
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
                        {searchQuery
                          ? "Tidak ada aparat yang ditemukan dengan pencarian tersebut."
                          : "Belum ada data aparat desa."}
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
                Tambah Aparat Baru
              </h3>
              <p className="text-gray-600 text-sm">
                Masukkan informasi aparat yang akan ditambahkan
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama"
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label
                  htmlFor="foto"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Foto Aparat
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="jabatan"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="jabatan"
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) =>
                      setFormData({ ...formData, jabatan: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Kepala Desa, Sekretaris"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nip"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    NIP
                  </label>
                  <input
                    id="nip"
                    type="text"
                    value={formData.nip || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nip: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan NIP atau NIK"
                  />
                </div>
              </div>

              {formData.fotoPreview && (
                <div className="relative w-40 h-16">
                  <img
                    src={formData.fotoPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md border-2 border-gray-200"
                  />
                </div>
              )}
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
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
              <h3 className="text-xl font-bold text-gray-800">Edit Aparat</h3>
              <p className="text-gray-600 text-sm">Ubah informasi aparat</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="edit-nama"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-nama"
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-foto"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Foto Aparat
                </label>
                <div className="flex flex-col gap-3">
                  {/* Foto preview */}
                  {formData.fotoPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 relative">
                        <img
                          src={formData.fotoPreview || "/placeholder.svg"}
                          alt="Foto"
                          className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={handleChangeThumbnail}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                          <FaExchangeAlt size={14} />
                          <span>Ganti Foto</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteThumbnail}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          <FaTrashAlt size={14} />
                          <span>Hapus Foto</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-400 text-2xl" />
                      </div>
                      <button
                        type="button"
                        onClick={handleChangeThumbnail}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        <FaPlus size={14} />
                        <span>Tambah Foto</span>
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
                    htmlFor="edit-jabatan"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-jabatan"
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) =>
                      setFormData({ ...formData, jabatan: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-nip"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    NIP
                  </label>
                  <input
                    id="edit-nip"
                    type="text"
                    value={formData.nip || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nip: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
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
                Apakah Anda yakin ingin menghapus aparat "{currentItem?.nama}"?
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
    </div>
  );
};

export default AparatAdmin;
