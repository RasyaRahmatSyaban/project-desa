"use client";

import { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserTie,
  FaPray,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaListAlt,
  FaHome,
  FaSpinner,
  FaExclamationTriangle,
  FaMars,
  FaVenus,
} from "react-icons/fa";

// Ubah import PopupForm untuk mengarah ke file .jsx bukan .tsx
import PopupForm from "./PopupForm.jsx";
import PendudukService from "../services/PendudukService";
import toast from "../../../components/Toast.jsx";

export default function Penduduk() {
  // Data penduduk individual
  const [pendudukData, setPendudukData] = useState([]);

  // Data agregat (yang ditampilkan di tabel)
  const [totalPenduduk, setTotalPenduduk] = useState([
    { kategori: "Laki-laki", total: 0 },
    { kategori: "Perempuan", total: 0 },
    { kategori: "Kepala Keluarga", total: 0 },
    { kategori: "Total Penduduk", total: 0 },
  ]);

  const [pendudukUsia, setPendudukUsia] = useState([]);
  const [pendudukKeyakinan, setPendudukKeyakinan] = useState([]);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk form dan UI
  const [showForm, setShowForm] = useState(false);
  const [showDataList, setShowDataList] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    nama: "",
    nik: "",
    alamat: "",
    tanggalLahir: "",
    jenisKelamin: "Laki-laki",
    agama: "Islam",
    kepalaKeluarga: false,
    selectedKK: "",
  });
  // State untuk daftar kepala keluarga
  const [kepalaKeluargaList, setKepalaKeluargaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Ubah state activeSection untuk mengelola tampilan halaman
  const [activeSection, setActiveSection] = useState("dashboard"); // "dashboard" atau "manage"

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch penduduk data
      const pendudukList = await PendudukService.getAllPenduduk();
      // Mapping: tambahkan field kepalaKeluarga berdasarkan id_kepalakeluarga
      const mapped = pendudukList.map((item) => ({
        ...item,
        kepalaKeluarga: item.id_kepalakeluarga === null,
      }));
      setPendudukData(mapped);

      // Fetch stats
      const stats = await PendudukService.getAllStats();

      // Update total penduduk
      setTotalPenduduk([
        { kategori: "Laki-laki", total: stats.summary.totalLakiLaki },
        { kategori: "Perempuan", total: stats.summary.totalPerempuan },
        {
          kategori: "Kepala Keluarga",
          total: stats.summary.totalKepalaKeluarga,
        },
        { kategori: "Total Penduduk", total: stats.summary.totalPenduduk },
      ]);

      // Update penduduk by umur
      setPendudukUsia(
        stats.byUmur.map((item) => ({
          kategori: item.kategori,
          total: item.total,
        }))
      );

      // Update penduduk by agama
      setPendudukKeyakinan(
        stats.byAgama.map((item) => ({
          kategori: item.agama,
          total: item.total,
        }))
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch kepala keluarga saat form dibuka
  const openForm = (editData = null) => {
    fetchKepalaKeluarga();
    if (editData) {
      setFormData({
        ...editData,
        tanggalLahir: editData.tanggalLahir ? editData.tanggalLahir.split("T")[0] : "",
        existingNik: editData.nik,
        kepalaKeluarga: !!editData.kepalaKeluarga,
        selectedKK: editData.id_kepalakeluarga || "",
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: 0,
        nama: "",
        nik: "",
        alamat: "",
        tanggalLahir: "",
        jenisKelamin: "Laki-laki",
        agama: "Islam",
        kepalaKeluarga: false,
        selectedKK: "",
      });
      setIsEditing(false);
    }
    setShowForm(true);
  };

  const fetchKepalaKeluarga = async () => {
    try {
      const list = await PendudukService.getAllKepalaKeluarga();
      setKepalaKeluargaList(list);
    } catch (e) {
      setKepalaKeluargaList([]);
    }
  };

  // Hitung umur berdasarkan tanggal lahir
  const hitungUmur = (tanggalLahir) => {
    const today = new Date();
    const birthDate = new Date(tanggalLahir);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Reset selectedKK jika kepalaKeluarga dicentang
      ...(name === "kepalaKeluarga" && checked ? { selectedKK: "" } : {}),
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi: jika bukan kepala keluarga, selectedKK wajib diisi
    if (!formData.kepalaKeluarga && !formData.selectedKK) {
      toast.error("Pilih kepala keluarga terlebih dahulu!");
      return;
    }
    try {
      if (isEditing) {
        await PendudukService.updatePenduduk(formData.existingNik, formData);
      } else {
        await PendudukService.addPenduduk(formData);
      }
      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat menyimpan data"
      );
    }
  };

  // Reset form
  const resetForm = (closeForm = true) => {
    setFormData({
      id: 0,
      nama: "",
      nik: "",
      alamat: "",
      tanggalLahir: "",
      jenisKelamin: "Laki-laki",
      agama: "Islam",
      kepalaKeluarga: false,
      selectedKK: "",
    });
    setIsEditing(false);
    if (closeForm) {
      setShowForm(false);
    }
  };

  // Edit data
  const handleEdit = (nik) => {
    const dataToEdit = pendudukData.find((item) => item.nik === nik);
    if (dataToEdit) {
      openForm(dataToEdit);
    }
  };

  // Delete data
  const handleDelete = async (nik) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await PendudukService.deletePenduduk(nik);
        // Refresh data
        await fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus data"
        );
      }
    }
  };

  // Get total for percentage calculations
  const getTotal = (data) => {
    return data.reduce((sum, item) => sum + item.total, 0);
  };

  // Render progress bar
  const renderProgressBar = (value, total) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Render summary cards
  const renderSummaryCards = () => {
    const totalSum = totalPenduduk[3].total;

    const cards = [
      {
        title: "Total Penduduk",
        value: totalSum,
        icon: <FaUsers className="text-blue-500" size={24} />,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Kepala Keluarga",
        value: totalPenduduk[2].total,
        icon: <FaUserTie className="text-green-500" size={24} />,
        color: "from-green-500 to-green-600",
      },
      {
        title: "Laki-laki",
        value: totalPenduduk[0].total,
        icon: <FaMars className="text-indigo-500" size={24} />,
        color: "from-indigo-500 to-indigo-600",
      },
      {
        title: "Perempuan",
        value: totalPenduduk[1].total,
        icon: <FaVenus className="text-pink-500" size={24} />,
        color: "from-pink-500 to-pink-600",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-xl">{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render reusable table
  const renderTable = (title, data, icon) => {
    const total = getTotal(data);

    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">{icon}</div>
            <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Kategori</th>
                  <th className="px-4 py-3 text-center font-medium">Total</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.kategori}</td>
                    <td className="px-4 py-3 text-center">
                      {title === "Total Penduduk" && idx === data.length - 1 ? (
                        <span className="text-blue-600 font-medium">
                          {row.total}
                        </span>
                      ) : (
                        row.total
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {title === "Total Penduduk" && idx === data.length - 1 ? (
                        <span className="text-blue-600 font-medium">100%</span>
                      ) : (
                        <div>
                          <span className="text-gray-700">
                            {total > 0
                              ? ((row.total / total) * 100).toFixed(1)
                              : 0}
                            %
                          </span>
                          {renderProgressBar(row.total, total)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render data list
  const renderDataList = () => {
    const filteredData = pendudukData.filter(
      (item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nik.includes(searchTerm) ||
        item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaListAlt className="text-blue-500" size={20} />
            </div>
            <h2 className="font-semibold text-xl text-gray-800">
              Daftar Penduduk
            </h2>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIK, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Nama</th>
                  <th className="px-4 py-3 text-left font-medium">NIK</th>
                  <th className="px-4 py-3 text-left font-medium">Alamat</th>
                  <th className="px-4 py-3 text-center font-medium">Umur</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Jenis Kelamin
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Agama</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Kepala Keluarga
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.nama}</td>
                    <td className="px-4 py-3">{item.nik}</td>
                    <td className="px-4 py-3">{item.alamat}</td>
                    <td className="px-4 py-3 text-center">
                      {hitungUmur(item.tanggalLahir)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.jenisKelamin}
                    </td>
                    <td className="px-4 py-3 text-center">{item.agama}</td>
                    <td className="px-4 py-3 text-center">
                      {item.kepalaKeluarga ? "Ya" : "Tidak"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item.nik)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.nik)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Tidak ada data yang sesuai dengan pencarian
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading && activeSection === "dashboard") {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2">Memuat data...</span>
      </div>
    );
  }

  // Error state
  if (error && activeSection === "dashboard") {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Main return
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Ubah bagian tombol di header utama, hapus tombol "Tambah Penduduk" */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Data Kependudukan
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveSection("manage");
              }}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaListAlt size={16} />
              <span>Kelola Data</span>
            </button>
          </div>
        </div>

        {/* Ubah bagian main return untuk menampilkan section yang berbeda berdasarkan activeSection */}
        {activeSection === "dashboard" ? (
          <>
            {renderSummaryCards()}

            <div className="mt-8 space-y-6">
              {renderTable(
                "Total Penduduk",
                totalPenduduk,
                <FaUsers className="text-blue-500" size={20} />
              )}

              {renderTable(
                "Jumlah Penduduk Berdasarkan Usia",
                pendudukUsia,
                <FaUsers className="text-green-500" size={20} />
              )}

              {/* Mengganti tabel pekerjaan dengan tabel jenis kelamin */}
              {renderTable(
                "Jumlah Penduduk Berdasarkan Jenis Kelamin",
                [
                  { kategori: "Laki-laki", total: totalPenduduk[0].total },
                  { kategori: "Perempuan", total: totalPenduduk[1].total },
                ],
                <FaUsers className="text-purple-500" size={20} />
              )}

              {renderTable(
                "Jumlah Penduduk Berdasarkan Keyakinan",
                pendudukKeyakinan,
                <FaPray className="text-orange-500" size={20} />
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Kelola Data Penduduk
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaHome size={16} />
                  <span>Kembali ke Dashboard</span>
                </button>
                <button
                  onClick={() => openForm()}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaUserPlus size={16} />
                  <span>Tambah Penduduk</span>
                </button>
              </div>
            </div>

            {/* Ubah bagian showForm untuk menggunakan PopupForm */}
            {showForm && (
              <PopupForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                isEditing={isEditing}
                kepalaKeluargaList={kepalaKeluargaList}
              />
            )}

            {renderDataList()}
          </div>
        )}
      </div>
    </div>
  );
}
