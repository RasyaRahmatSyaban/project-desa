"use client";

import { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaChartPie,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import APBDesServiceAdmin from "../../services/admin/APBDesServiceAdmin";
import DanaMasukForm from "./DanaMasukForm";
import DanaKeluarForm from "./DanaKeluarForm";
import toast from "../Toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function APBDes() {
  // State untuk data
  const [danaMasuk, setDanaMasuk] = useState([]);
  const [danaKeluar, setDanaKeluar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk form dan UI
  const [showDanaMasukForm, setShowDanaMasukForm] = useState(false);
  const [showDanaKeluarForm, setShowDanaKeluarForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [availableYears, setAvailableYears] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("summary"); // "summary", "income", "expense"

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch dana masuk and dana keluar
      const [masukData, keluarData] = await Promise.all([
        APBDesServiceAdmin.getAllDanaMasuk(),
        APBDesServiceAdmin.getAllDanaKeluar(),
      ]);

      setDanaMasuk(masukData);
      setDanaKeluar(keluarData);

      // Extract available years
      const years = new Set();
      masukData.forEach((item) => years.add(item.tahun));
      keluarData.forEach((item) => years.add(item.tahun));

      // Convert to array and sort in descending order
      const yearsArray = Array.from(years).sort((a, b) => b - a);
      setAvailableYears(yearsArray);

      // Set default selected year to the most recent year or current year
      if (yearsArray.length > 0) {
        setSelectedYear(yearsArray[0]);
      } else {
        setSelectedYear(new Date().getFullYear().toString());
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data by selected year
  const filteredDanaMasuk = danaMasuk.filter(
    (item) => item.tahun === selectedYear
  );
  const filteredDanaKeluar = danaKeluar.filter(
    (item) => item.tahun === selectedYear
  );

  // Calculate totals
  const totalPendapatan = filteredDanaMasuk.reduce(
    (sum, item) => sum + Number.parseInt(item.jumlah),
    0
  );
  const totalPengeluaran = filteredDanaKeluar.reduce(
    (sum, item) => sum + Number.parseInt(item.jumlah),
    0
  );
  const saldo = totalPendapatan - totalPengeluaran;

  // Handle form submissions
  const handleAddDanaMasuk = async (formData) => {
    try {
      await APBDesServiceAdmin.addDanaMasuk(formData);
      setShowDanaMasukForm(false);
      fetchData();
    } catch (error) {
      console.error("Error adding dana masuk:", error);
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat menyimpan data"
      );
    }
  };

  const handleUpdateDanaMasuk = async (id, formData) => {
    try {
      await APBDesServiceAdmin.updateDanaMasuk(id, formData);
      setShowDanaMasukForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error updating dana masuk:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data"
      );
    }
  };

  const handleDeleteDanaMasuk = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await APBDesServiceAdmin.deleteDanaMasuk(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting dana masuk:", error);
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus data"
        );
      }
    }
  };

  const handleAddDanaKeluar = async (formData) => {
    try {
      await APBDesServiceAdmin.addDanaKeluar(formData);
      setShowDanaKeluarForm(false);
      fetchData();
    } catch (error) {
      console.error("Error adding dana keluar:", error);
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat menyimpan data"
      );
    }
  };

  const handleUpdateDanaKeluar = async (id, formData) => {
    try {
      await APBDesServiceAdmin.updateDanaKeluar(id, formData);
      setShowDanaKeluarForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error updating dana keluar:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data"
      );
    }
  };

  const handleDeleteDanaKeluar = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await APBDesServiceAdmin.deleteDanaKeluar(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting dana keluar:", error);
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus data"
        );
      }
    }
  };

  // Edit handlers
  const handleEditDanaMasuk = (item) => {
    setEditingItem(item);
    setShowDanaMasukForm(true);
  };

  const handleEditDanaKeluar = (item) => {
    setEditingItem(item);
    setShowDanaKeluarForm(true);
  };

  // Prepare chart data
  const preparePieChartData = () => {
    return {
      labels: ["Pendapatan", "Pengeluaran"],
      datasets: [
        {
          data: [totalPendapatan, totalPengeluaran],
          backgroundColor: ["#10b981", "#ef4444"],
          borderColor: ["#10b981", "#ef4444"],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareBarChartData = () => {
    // Create an array of all months (1-12)
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Map income data by month
    const incomeByMonth = new Map();
    filteredDanaMasuk.forEach((item) => {
      const month = Number.parseInt(item.bulan);
      incomeByMonth.set(
        month,
        (incomeByMonth.get(month) || 0) + Number.parseInt(item.jumlah)
      );
    });

    // Map expense data by month
    const expenseByMonth = new Map();
    filteredDanaKeluar.forEach((item) => {
      const month = Number.parseInt(item.bulan);
      expenseByMonth.set(
        month,
        (expenseByMonth.get(month) || 0) + Number.parseInt(item.jumlah)
      );
    });

    // Prepare data for chart
    const incomeData = months.map((month) => incomeByMonth.get(month) || 0);
    const expenseData = months.map((month) => expenseByMonth.get(month) || 0);

    return {
      labels: months.map((month) => APBDesService.getMonthName(month)),
      datasets: [
        {
          label: "Pendapatan",
          data: incomeData,
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1,
        },
        {
          label: "Pengeluaran",
          data: expenseData,
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Render summary cards
  const renderSummaryCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Pendapatan
            </h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <FaMoneyBillWave className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {APBDesService.formatCurrency(totalPendapatan)}
          </div>
          <p className="text-sm text-gray-600">Tahun {selectedYear}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Pengeluaran
            </h3>
            <div className="bg-red-100 p-2 rounded-lg">
              <FaMoneyCheckAlt className="text-red-500 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {APBDesService.formatCurrency(totalPengeluaran)}
          </div>
          <p className="text-sm text-gray-600">Tahun {selectedYear}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Saldo</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaChartPie className="text-blue-500 text-xl" />
            </div>
          </div>
          <div
            className={`text-3xl font-bold mb-1 ${
              saldo >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {APBDesService.formatCurrency(saldo)}
          </div>
          <p className="text-sm text-gray-600">Tahun {selectedYear}</p>
        </div>
      </div>
    );
  };

  // Render charts
  const renderCharts = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Perbandingan Pendapatan dan Pengeluaran
          </h3>
          <div className="h-64">
            <Pie
              data={preparePieChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw;
                        return `${
                          context.label
                        }: ${APBDesService.formatCurrency(value)}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Pendapatan dan Pengeluaran Bulanan
          </h3>
          <div className="h-64">
            <Bar
              data={prepareBarChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw;
                        return `${
                          context.dataset.label
                        }: ${APBDesService.formatCurrency(value)}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => APBDesService.formatCurrency(value),
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render dana masuk table
  const renderDanaMasukTable = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaMoneyBillWave className="text-green-500 text-xl" />
              </div>
              <h2 className="font-semibold text-xl text-gray-800">
                Data Pendapatan
              </h2>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowDanaMasukForm(true);
              }}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus size={16} />
              <span>Tambah Pendapatan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-600">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-green-50 rounded-tl-lg">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-green-50">
                    Tahun
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-green-50">
                    Bulan
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 bg-green-50">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-green-50">
                    Sumber
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-green-50">
                    Keterangan
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 bg-green-50 rounded-tr-lg">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDanaMasuk.length > 0 ? (
                  filteredDanaMasuk.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.tahun}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {APBDesService.getMonthName(item.bulan)}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 font-mono font-medium text-right">
                        {APBDesService.formatCurrency(item.jumlah)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.sumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                        {item.keterangan}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditDanaMasuk(item)}
                            className="p-1.5 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors shadow-sm"
                            title="Edit"
                          >
                            <FaEdit className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteDanaMasuk(item.id)}
                            className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 transition-colors shadow-sm"
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
                      className="px-4 py-8 text-center text-gray-500 italic"
                    >
                      Tidak ada data pendapatan untuk tahun {selectedYear}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 font-medium text-right bg-green-50 rounded-bl-lg"
                  >
                    Total:
                  </td>
                  <td className="px-4 py-3 font-medium text-right bg-green-50 text-green-600 font-mono">
                    {APBDesService.formatCurrency(totalPendapatan)}
                  </td>
                  <td
                    colSpan={3}
                    className="px-4 py-3 bg-green-50 rounded-br-lg"
                  ></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render dana keluar table
  const renderDanaKeluarTable = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <FaMoneyCheckAlt className="text-red-500 text-xl" />
              </div>
              <h2 className="font-semibold text-xl text-gray-800">
                Data Pengeluaran
              </h2>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowDanaKeluarForm(true);
              }}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus size={16} />
              <span>Tambah Pengeluaran</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-600">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-red-50 rounded-tl-lg">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-red-50">
                    Tahun
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-red-50">
                    Bulan
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 bg-red-50">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-red-50">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 bg-red-50">
                    Keterangan
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 bg-red-50 rounded-tr-lg">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDanaKeluar.length > 0 ? (
                  filteredDanaKeluar.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.tahun}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {APBDesService.getMonthName(item.bulan)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 font-mono font-medium text-right">
                        {APBDesService.formatCurrency(item.jumlah)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                        {item.keterangan}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditDanaKeluar(item)}
                            className="p-1.5 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors shadow-sm"
                            title="Edit"
                          >
                            <FaEdit className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteDanaKeluar(item.id)}
                            className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 transition-colors shadow-sm"
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
                      className="px-4 py-8 text-center text-gray-500 italic"
                    >
                      Tidak ada data pengeluaran untuk tahun {selectedYear}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 font-medium text-right bg-red-50 rounded-bl-lg"
                  >
                    Total:
                  </td>
                  <td className="px-4 py-3 font-medium text-right bg-red-50 text-red-600 font-mono">
                    {APBDesService.formatCurrency(totalPengeluaran)}
                  </td>
                  <td
                    colSpan={3}
                    className="px-4 py-3 bg-red-50 rounded-br-lg"
                  ></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2">Memuat data...</span>
      </div>
    );
  }

  // Error state
  if (error) {
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

  return (
    <div
      className="space-y-8 bg-gray-50 min-h-screen"
      style={{ fontFamily: "poppins" }}
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen APBDes</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.length > 0 ? (
                  availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>
                    {new Date().getFullYear()}
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "summary"
                  ? "bg-blue-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaChartPie
                className={
                  activeTab === "summary" ? "text-white" : "text-blue-500"
                }
              />
              <span>Ringkasan</span>
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "income"
                  ? "bg-green-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaMoneyBillWave
                className={
                  activeTab === "income" ? "text-white" : "text-green-500"
                }
              />
              <span>Pendapatan</span>
            </button>
            <button
              onClick={() => setActiveTab("expense")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "expense"
                  ? "bg-red-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaMoneyCheckAlt
                className={
                  activeTab === "expense" ? "text-white" : "text-red-500"
                }
              />
              <span>Pengeluaran</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            {renderSummaryCards()}
            {renderCharts()}
          </div>
        )}

        {activeTab === "income" && (
          <div className="space-y-6">{renderDanaMasukTable()}</div>
        )}

        {activeTab === "expense" && (
          <div className="space-y-6">{renderDanaKeluarTable()}</div>
        )}

        {/* Forms */}
        <div
          className={`${
            showDanaMasukForm || showDanaKeluarForm
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } transition-opacity duration-300`}
        >
          {showDanaMasukForm && (
            <DanaMasukForm
              onSubmit={
                editingItem
                  ? (formData) =>
                      handleUpdateDanaMasuk(editingItem.id, formData)
                  : handleAddDanaMasuk
              }
              onCancel={() => {
                setShowDanaMasukForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              isEditing={!!editingItem}
            />
          )}

          {showDanaKeluarForm && (
            <DanaKeluarForm
              onSubmit={
                editingItem
                  ? (formData) =>
                      handleUpdateDanaKeluar(editingItem.id, formData)
                  : handleAddDanaKeluar
              }
              onCancel={() => {
                setShowDanaKeluarForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              isEditing={!!editingItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}
