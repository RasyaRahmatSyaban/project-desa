"use client";

import { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaEnvelopeOpen,
  FaEnvelope,
  FaDownload,
  FaEye,
  FaSearch,
  FaCalendarAlt,
  FaSpinner,
  FaFilePdf,
  FaExclamationTriangle,
  FaTimesCircle, // Tambahkan import ini
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SuratServiceUser from "../services/user/SuratServiceUser";
import toast from "../components/Toast";

export default function ArsipSurat() {
  const [suratData, setSuratData] = useState({});
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [activeTab, setActiveTab] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // PDF viewer state
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Tambahkan fungsi formatDate untuk memastikan tampilan tanggal yang konsisten
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      // Periksa apakah tanggal valid
      if (isNaN(date.getTime())) {
        // Jika format tanggal tidak standar, tampilkan apa adanya
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

  // Fetch available years on component mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await SuratServiceUser.getAvailableYears();
        setAvailableYears(years);

        // Set selected year to the most recent year
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        console.error("Error fetching years:", err);
        setError("Gagal memuat data tahun.");
      }
    };

    fetchYears();
  }, []);

  // Fetch data for selected year
  useEffect(() => {
    if (!selectedYear) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await SuratServiceUser.getSuratByYear(selectedYear);

        // Update suratData state with the fetched data
        setSuratData((prevData) => ({
          ...prevData,
          [selectedYear]: data,
        }));
      } catch (err) {
        console.error(`Error fetching data for year ${selectedYear}:`, err);
        setError(`Gagal memuat data untuk tahun ${selectedYear}.`);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if we already have data for this year
    if (!suratData[selectedYear]) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [selectedYear, suratData]);

  // Get current year's data
  const currentYearData = suratData[selectedYear] || [];

  // Filter data based on active tab and search query
  const filteredData = currentYearData.filter((item) => {
    const matchesSearch =
      (item.judul?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.nomor?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.perihal?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeTab === "semua" ||
      (activeTab === "masuk" && item.jenis === "Surat Masuk") ||
      (activeTab === "keluar" && item.jenis === "Surat Keluar");

    return matchesSearch && matchesFilter;
  });

  // Count by type
  const countMasuk = currentYearData.filter(
    (item) => item.jenis === "Surat Masuk"
  ).length;
  const countKeluar = currentYearData.filter(
    (item) => item.jenis === "Surat Keluar"
  ).length;

  // Handle preview - PERBAIKAN UTAMA
  const handlePreview = async (item) => {
    setPdfLoading(true);
    setPdfError(false);
    setPdfUrl(null);
    setCurrentItem(item); // Set current item terlebih dahulu

    try {
      if (item.file) {
        const fileUrl = SuratServiceUser.getFileUrl(item.file);

        const fileExists = await SuratServiceUser.checkFileExists(item.file);

        if (fileExists) {
          setPdfUrl(fileUrl);
          setPdfError(false);
        } else {
          console.error("File not found or inaccessible:", fileUrl);
          setPdfError(true);
        }
      } else {
        setPdfError(true);
      }
    } catch (error) {
      console.error("Error preparing file for preview:", error);
      setPdfError(true);
    } finally {
      setPdfLoading(false);
      setShowPreviewModal(true); // Tampilkan modal setelah proses selesai
    }
  };

  // Handle file download
  const handleDownload = async (fileName) => {
    if (!fileName) {
      toast.info("File tidak tersedia untuk diunduh");
      return;
    }

    try {
      const success = await SuratServiceUser.downloadFile(fileName);
      if (!success) {
        toast.error("Terjadi kesalahan saat mengunduh file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Terjadi kesalahan saat mengunduh file");
    }
  };

  // Get icon and color based on surat type
  const getSuratIcon = (type) => {
    if (type === "Surat Masuk") {
      return <FaEnvelopeOpen className="text-[#FE7C66]" />;
    } else {
      return <FaEnvelope className="text-[#5DE1C4]" />;
    }
  };

  return (
    <>
      <div
        className="flex flex-col bg-gray-50 min-h-screen pt-20"
        style={{ fontFamily: "poppins" }}
      >
        <Navbar />

        <div className="w-full flex-grow">
          {/* Header */}
          <div className="w-full px-8 md:px-18 lg:px-32 py-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#6CABCA] to-[#315263] bg-clip-text text-transparent mb-2 py-5">
              Arsip Surat Desa
            </h1>
            <p className="text-gray-600 max-w-2xl text-lg md:text-xl lg:text-2xl mx-auto pt-5">
              Akses dan unduh dokumen surat menyurat desa dengan mudah.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="w-full px-8 md:px-18 lg:px-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Total Dokumen
                  </h3>
                  <div className="bg-gray-100 bg-opacity-20 p-2 rounded-lg">
                    <FaFileAlt className="text-[#B9FF66] text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {currentYearData.length}
                </div>
                <p className="text-sm text-gray-600">
                  Dokumen tersedia ({selectedYear})
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Surat Masuk
                  </h3>
                  <div className="bg-gray-100 bg-opacity-20 p-2 rounded-lg">
                    <FaEnvelopeOpen className="text-[#FE7C66] text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {countMasuk}
                </div>
                <p className="text-sm text-gray-600">
                  Surat masuk ({selectedYear})
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Surat Keluar
                  </h3>
                  <div className="bg-gray-100 bg-opacity-20 p-2 rounded-lg">
                    <FaEnvelope className="text-[#5DE1C4] text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {countKeluar}
                </div>
                <p className="text-sm text-gray-600">
                  Surat keluar ({selectedYear})
                </p>
              </div>
            </div>
          </div>

          {/* Filter and Search */}
          <div className="w-full px-8 md:px-18 lg:px-32 mb-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {/* Year Selection */}
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#6CABCA]" />
                  <span className="text-gray-700 font-medium">
                    Pilih Tahun:
                  </span>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#6CABCA] focus:border-[#6CABCA]"
                    onChange={(e) => setSelectedYear(e.target.value)}
                    value={selectedYear}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari surat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CABCA] focus:border-[#6CABCA] w-full md:w-64"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("semua")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === "semua"
                      ? "bg-[#B9FF66] text-gray-800 font-medium shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaFileAlt
                    className={
                      activeTab === "semua" ? "text-gray-800" : "text-[#B9FF66]"
                    }
                  />
                  <span>Semua Surat</span>
                </button>
                <button
                  onClick={() => setActiveTab("masuk")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === "masuk"
                      ? "bg-[#FE7C66] text-white font-medium shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaEnvelopeOpen
                    className={
                      activeTab === "masuk" ? "text-white" : "text-[#FE7C66]"
                    }
                  />
                  <span>Surat Masuk</span>
                </button>
                <button
                  onClick={() => setActiveTab("keluar")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === "keluar"
                      ? "bg-[#5DE1C4] text-white font-medium shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaEnvelope
                    className={
                      activeTab === "keluar" ? "text-white" : "text-[#5DE1C4]"
                    }
                  />
                  <span>Surat Keluar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Surat Table */}
          <div className="w-full px-8 md:px-18 lg:px-32">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Daftar Surat ({selectedYear})
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Total {filteredData.length} surat ditemukan
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-[#6CABCA]" />
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center py-12">
                  <FaExclamationTriangle className="text-4xl text-yellow-500 mb-2" />
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#6CABCA] text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : filteredData.length > 0 ? (
                <>
                  <div className="hidden sm:block">
                    <div className="overflow-x-auto">
                      <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Jenis
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Nomor & Tanggal
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Judul / Perihal
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredData.map((surat) => (
                            <tr key={surat.id} className="hover:bg-gray-50">
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  {getSuratIcon(surat.jenis)}
                                  <span className="hidden md:inline">
                                    {surat.jenis}
                                  </span>
                                  <span className="md:hidden text-xs">
                                    {surat.jenis}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {surat.nomor || "-"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDate(surat.tanggal)}
                                </div>
                              </td>
                              <td className="px-3 py-4 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {surat.judul || "-"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                  {surat.perihal || "-"}
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-center">
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
                                  <button
                                    onClick={() => handlePreview(surat)}
                                    className="inline-flex items-center justify-center px-2 sm:px-3 py-1 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                                  >
                                    <FaEye className="sm:mr-1" />
                                    <span className="hidden sm:inline ml-1">
                                      Lihat
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => handleDownload(surat.file)}
                                    className="inline-flex items-center justify-center px-2 sm:px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-[#6CABCA] hover:bg-[#5892b1] transition"
                                  >
                                    <FaDownload className="sm:mr-1" />
                                    <span className="hidden sm:inline ml-1">
                                      Unduh
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="sm:hidden space-y-4">
                    {filteredData.map((surat) => (
                      <div
                        key={surat.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        {/* Header dengan Jenis dan Tanggal */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getSuratIcon(surat.jenis)}
                            <span className="text-sm font-medium text-gray-900">
                              {surat.jenis}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(surat.tanggal)}
                          </div>
                        </div>

                        {/* Nomor */}
                        {surat.nomor && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              NOMOR:
                            </span>
                            <div className="text-sm text-gray-900">
                              {surat.nomor}
                            </div>
                          </div>
                        )}

                        {/* Judul */}
                        {surat.judul && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              JUDUL:
                            </span>
                            <div className="text-sm font-medium text-gray-900">
                              {surat.judul}
                            </div>
                          </div>
                        )}

                        {/* Perihal */}
                        {surat.perihal && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-gray-500">
                              PERIHAL:
                            </span>
                            <div className="text-sm text-gray-500">
                              {surat.perihal}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handlePreview(surat)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <FaEye className="mr-2" /> Lihat
                          </button>
                          <button
                            onClick={() => handleDownload(surat.file)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#6CABCA] hover:bg-[#5892b1] transition"
                          >
                            <FaDownload className="mr-2" /> Unduh
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    Tidak ada surat yang ditemukan untuk tahun ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreviewModal && (
          <div
            className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-75 flex items-center justify-center p-4"
            onClick={() => setShowPreviewModal(false)}
          >
            <div
              className="relative bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute top-4 right-4 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
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
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {currentItem?.judul || "Pratinjau Dokumen"}
                </h3>
                <p className="text-sm text-gray-500">
                  Nomor: {currentItem?.nomor || "-"}
                </p>
              </div>

              {/* PDF Viewer */}
              <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
                {pdfLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
                    <FaSpinner className="animate-spin text-4xl text-white" />
                  </div>
                ) : pdfError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                    <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
                    <p className="text-gray-700 mb-4">
                      Dokumen tidak dapat dimuat atau tidak tersedia.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          window.open(
                            SuratServiceUser.getFileUrl(currentItem?.file),
                            "_blank"
                          )
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Buka di Tab Baru
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    title={currentItem?.judul}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
