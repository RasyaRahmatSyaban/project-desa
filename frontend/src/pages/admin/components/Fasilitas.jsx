"use client";

import { useState } from "react";
import {
  FaBuilding,
  FaHospital,
  FaIndustry,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

export default function FasilitasWrapper() {
  // Dummy Data
  const [dataFasilitasUmum, setDataFasilitasUmum] = useState([
    { id: 1, kategori: "Taman Desa", jumlah: 2 },
    { id: 2, kategori: "Balai Desa", jumlah: 1 },
  ]);

  const [dataFasilitasKesehatan, setDataFasilitasKesehatan] = useState([
    { id: 1, kategori: "Puskesmas", jumlah: 1 },
    { id: 2, kategori: "Posyandu", jumlah: 3 },
  ]);

  const [dataFasilitasIndustri, setDataFasilitasIndustri] = useState([
    { id: 1, kategori: "Pabrik Batik", jumlah: 2 },
    { id: 2, kategori: "Home Industry", jumlah: 5 },
  ]);

  // Active tab state
  const [activeTab, setActiveTab] = useState("umum");

  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState("");
  const [currentItem, setCurrentItem] = useState({
    id: 0,
    kategori: "",
    jumlah: 0,
  });
  const [newKategori, setNewKategori] = useState("");
  const [newJumlah, setNewJumlah] = useState(0);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Actions
  const handleAdd = (type) => {
    setCurrentType(type);
    setNewKategori("");
    setNewJumlah(0);
    setIsAddDialogOpen(true);
    setShowAddModal(true);
  };

  const handleEdit = (id, type) => {
    setCurrentType(type);
    let item;

    if (type === "Fasilitas Umum") {
      item = dataFasilitasUmum.find((item) => item.id === id);
    } else if (type === "Fasilitas Kesehatan") {
      item = dataFasilitasKesehatan.find((item) => item.id === id);
    } else {
      item = dataFasilitasIndustri.find((item) => item.id === id);
    }

    if (item) {
      setCurrentItem(item);
      setNewKategori(item.kategori);
      setNewJumlah(item.jumlah);
      setIsEditDialogOpen(true);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id, type) => {
    setCurrentType(type);
    let item;

    if (type === "Fasilitas Umum") {
      item = dataFasilitasUmum.find((item) => item.id === id);
    } else if (type === "Fasilitas Kesehatan") {
      item = dataFasilitasKesehatan.find((item) => item.id === id);
    } else {
      item = dataFasilitasIndustri.find((item) => item.id === id);
    }

    if (item) {
      setCurrentItem(item);
      setIsDeleteDialogOpen(true);
      setShowDeleteModal(true);
    }
  };

  const saveNewItem = () => {
    const newItem = {
      id: Math.floor(Math.random() * 1000),
      kategori: newKategori,
      jumlah: newJumlah,
    };

    if (currentType === "Fasilitas Umum") {
      setDataFasilitasUmum([...dataFasilitasUmum, newItem]);
    } else if (currentType === "Fasilitas Kesehatan") {
      setDataFasilitasKesehatan([...dataFasilitasKesehatan, newItem]);
    } else {
      setDataFasilitasIndustri([...dataFasilitasIndustri, newItem]);
    }

    setIsAddDialogOpen(false);
    setShowAddModal(false);
  };

  const saveEditedItem = () => {
    const updatedItem = {
      ...currentItem,
      kategori: newKategori,
      jumlah: newJumlah,
    };

    if (currentType === "Fasilitas Umum") {
      setDataFasilitasUmum(
        dataFasilitasUmum.map((item) =>
          item.id === currentItem.id ? updatedItem : item
        )
      );
    } else if (currentType === "Fasilitas Kesehatan") {
      setDataFasilitasKesehatan(
        dataFasilitasKesehatan.map((item) =>
          item.id === currentItem.id ? updatedItem : item
        )
      );
    } else {
      setDataFasilitasIndustri(
        dataFasilitasIndustri.map((item) =>
          item.id === currentItem.id ? updatedItem : item
        )
      );
    }

    setIsEditDialogOpen(false);
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (currentType === "Fasilitas Umum") {
      setDataFasilitasUmum(
        dataFasilitasUmum.filter((item) => item.id !== currentItem.id)
      );
    } else if (currentType === "Fasilitas Kesehatan") {
      setDataFasilitasKesehatan(
        dataFasilitasKesehatan.filter((item) => item.id !== currentItem.id)
      );
    } else {
      setDataFasilitasIndustri(
        dataFasilitasIndustri.filter((item) => item.id !== currentItem.id)
      );
    }

    setIsDeleteDialogOpen(false);
    setShowDeleteModal(false);
  };

  // Calculate totals
  const totalUmum = dataFasilitasUmum.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );
  const totalKesehatan = dataFasilitasKesehatan.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );
  const totalIndustri = dataFasilitasIndustri.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Fasilitas Umum
            </h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaBuilding className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalUmum}
          </div>
          <p className="text-sm text-gray-600">
            {dataFasilitasUmum.length} kategori fasilitas
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Fasilitas Kesehatan
            </h3>
            <div className="bg-red-100 p-2 rounded-lg">
              <FaHospital className="text-red-500 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalKesehatan}
          </div>
          <p className="text-sm text-gray-600">
            {dataFasilitasKesehatan.length} kategori fasilitas
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Fasilitas Industri
            </h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <FaIndustry className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalIndustri}
          </div>
          <p className="text-sm text-gray-600">
            {dataFasilitasIndustri.length} kategori fasilitas
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("umum")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "umum"
                ? "bg-blue-500 text-white font-medium shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaBuilding
              className={activeTab === "umum" ? "text-white" : "text-blue-500"}
            />
            <span>Fasilitas Umum</span>
          </button>
          <button
            onClick={() => setActiveTab("kesehatan")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "kesehatan"
                ? "bg-red-500 text-white font-medium shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaHospital
              className={
                activeTab === "kesehatan" ? "text-white" : "text-red-500"
              }
            />
            <span>Fasilitas Kesehatan</span>
          </button>
          <button
            onClick={() => setActiveTab("industri")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "industri"
                ? "bg-green-500 text-white font-medium shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaIndustry
              className={
                activeTab === "industri" ? "text-white" : "text-green-500"
              }
            />
            <span>Fasilitas Industri</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {/* Fasilitas Umum Content */}
        {activeTab === "umum" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Fasilitas Umum
                </h2>
                <p className="text-gray-600 text-sm">
                  Data kategori dan jumlah fasilitas umum desa.
                </p>
              </div>
              <button
                onClick={() => handleAdd("Fasilitas Umum")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaPlus className="text-white" />
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 rounded-tl-lg">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 rounded-tr-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataFasilitasUmum.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.kategori}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.jumlah}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(item.id, "Fasilitas Umum")
                            }
                            className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            <FaEdit className="text-gray-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item.id, "Fasilitas Umum")
                            }
                            className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <FaTrash className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fasilitas Kesehatan Content */}
        {activeTab === "kesehatan" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Fasilitas Kesehatan
                </h2>
                <p className="text-gray-600 text-sm">
                  Data kategori dan jumlah fasilitas kesehatan desa.
                </p>
              </div>
              <button
                onClick={() => handleAdd("Fasilitas Kesehatan")}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaPlus className="text-white" />
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 rounded-tl-lg">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 rounded-tr-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataFasilitasKesehatan.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.kategori}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.jumlah}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(item.id, "Fasilitas Kesehatan")
                            }
                            className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            <FaEdit className="text-gray-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item.id, "Fasilitas Kesehatan")
                            }
                            className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <FaTrash className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fasilitas Industri Content */}
        {activeTab === "industri" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Fasilitas Industri
                </h2>
                <p className="text-gray-600 text-sm">
                  Data kategori dan jumlah fasilitas industri desa.
                </p>
              </div>
              <button
                onClick={() => handleAdd("Fasilitas Industri")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaPlus className="text-white" />
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 rounded-tl-lg">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 rounded-tr-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataFasilitasIndustri.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.kategori}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.jumlah}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(item.id, "Fasilitas Industri")
                            }
                            className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            <FaEdit className="text-gray-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item.id, "Fasilitas Industri")
                            }
                            className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <FaTrash className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Tambah Kategori {currentType}
              </h3>
              <p className="text-gray-600 text-sm">
                Masukkan informasi kategori fasilitas baru di bawah ini.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="kategori"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori
                </label>
                <input
                  id="kategori"
                  type="text"
                  value={newKategori}
                  onChange={(e) => setNewKategori(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama kategori"
                />
              </div>
              <div>
                <label
                  htmlFor="jumlah"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Jumlah
                </label>
                <input
                  id="jumlah"
                  type="number"
                  value={newJumlah}
                  onChange={(e) =>
                    setNewJumlah(Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jumlah fasilitas"
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
              <h3 className="text-xl font-bold text-gray-800">
                Edit Kategori {currentType}
              </h3>
              <p className="text-gray-600 text-sm">
                Ubah informasi kategori fasilitas di bawah ini.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="edit-kategori"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori
                </label>
                <input
                  id="edit-kategori"
                  type="text"
                  value={newKategori}
                  onChange={(e) => setNewKategori(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-jumlah"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Jumlah
                </label>
                <input
                  id="edit-jumlah"
                  type="number"
                  value={newJumlah}
                  onChange={(e) =>
                    setNewJumlah(Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                Apakah Anda yakin ingin menghapus kategori "
                {currentItem.kategori}"? Tindakan ini tidak dapat dibatalkan.
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
    </>
  );
}
