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
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SuratService from "../pages/admin/services/SuratServiceAdmin";
import toast from "../components/Toast";

export default function ArsipSurat() {
  const [suratData, setSuratData] = useState({});
  const [availableYears, setAvailableYears] = useState([
    "2025",
    "2024",
    "2023",
  ]);
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
        const years = await SuratService.getAvailableYears();
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
        const data = await SuratService.getSuratByYear(selectedYear);

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
  }, [selectedYear]);

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

  // Handle preview
  const handlePreview = async (item) => {
    setPdfLoading(true);
    setPdfError(false);
    setPdfUrl(null);

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

        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-9xl font-bold bg-gradient-to-r from-[#6CABCA] to-[#315263] bg-clip-text text-transparent mb-2 py-5">
                Arsip Surat Desa
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Akses dan unduh dokumen surat resmi desa untuk keperluan
                informasi dan transparansi publik
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Total Surat
                  </h3>
                  <div className="bg-gray-100 bg-opacity-20 p-2 rounded-lg">
                    <FaFileAlt className="text-[#B9FF66] text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {currentYearData.length}
                </div>
                <p className="text-sm text-gray-600">
                  Surat tersedia tahun {selectedYear}
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
                <p className="text-sm text-gray-600">Surat masuk tersedia</p>
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
                <p className="text-sm text-gray-600">Surat keluar tersedia</p>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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

            {/* Document List */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Daftar Surat Tahun {selectedYear}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Akses dan unduh dokumen surat resmi desa
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin text-4xl text-[#6CABCA] mx-auto mb-4" />
                  <p className="mt-2 text-gray-600">Memuat data...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                  <button
                    onClick={() => {
                      // Refetch data for the selected year
                      setSuratData((prevData) => {
                        const newData = { ...prevData };
                        delete newData[selectedYear];
                        return newData;
                      });
                    }}
                    className="mt-2 px-4 py-2 bg-[#6CABCA] text-white rounded-lg hover:bg-opacity-90 transition-colors"
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
                          Judul
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Perihal
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 rounded-tr-lg">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.length > 0 ? (
                        filteredData.map((surat) => (
                          <tr key={surat.id} className="hover:bg-gray-50">
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
                              {surat.judul}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {formatDate(surat.tanggal)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {surat.perihal}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handlePreview(surat)}
                                  className="p-1.5 bg-gray-100 bg-opacity-20 rounded-md hover:bg-gray-200 hover:bg-opacity-30 transition-colors"
                                  title="Lihat Detail"
                                >
                                  <FaEye className="text-[#6CABCA]" />
                                </button>
                                {surat.file && (
                                  <button
                                    onClick={() => handleDownload(surat.file)}
                                    className="p-1.5 bg-gray-100 bg-opacity-20 rounded-md hover:bg-gray-200 hover:bg-opacity-30 transition-colors"
                                    title="Unduh"
                                  >
                                    <FaDownload className="text-[#6CABCA]" />
                                  </button>
                                )}
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
                            <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-3" />
                            <p>Tidak ada surat yang ditemukan</p>
                            <p className="text-gray-400 text-sm">
                              Coba ubah filter atau kata kunci pencarian
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreviewModal && currentItem && (
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-700/30 flex items-center justify-center z-50 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {getSuratIcon(currentItem.jenis)}{" "}
                  {currentItem.judul || currentItem.perihal}
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
                    <p className="font-medium">{currentItem.nomor}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Jenis</p>
                    <p className="font-medium">{currentItem.jenis}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal</p>
                    <p className="font-medium">
                      {formatDate(currentItem.tanggal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Perihal</p>
                    <p className="font-medium">{currentItem.perihal}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Preview Dokumen
                </h4>
                <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4 max-w-full overflow-hidden">
                  {pdfLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FaSpinner className="animate-spin text-4xl text-[#6CABCA] mb-4" />
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
                      <div className="h-[400px] w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <iframe
                          src={pdfUrl}
                          className="w-full h-full"
                          title={currentItem.judul || currentItem.perihal}
                        >
                          Browser Anda tidak mendukung tampilan PDF.
                        </iframe>
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
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                      <FaFileAlt className="text-gray-300 text-5xl mb-3" />
                      <p className="text-gray-500 px-2">
                        Dokumen tidak tersedia untuk ditampilkan
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
      <Footer />
    </>
  );
}
