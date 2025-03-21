"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaImage,
  FaVideo,
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaDownload,
  FaPhotoVideo,
  FaPlay,
  FaSpinner,
  FaExclamationTriangle,
  FaFileAlt,
  FaTimesCircle,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaService from "../pages/admin/services/MediaServiceAdm";

export default function Media() {
  // State untuk data
  const [mediaData, setMediaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for active tab/filter
  const [activeTab, setActiveTab] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  // State untuk tahun
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  // Tambahkan state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 items per page (2 rows of 4)

  // Fetch data on component mount
  useEffect(() => {
    fetchMediaData();
  }, []);

  // Perbaiki fungsi fetchMediaData untuk menangani tahun dengan benar
  const fetchMediaData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MediaService.getAllMedia();
      setMediaData(data);

      // Extract unique years from data
      if (data.length > 0) {
        // Pendekatan baru untuk ekstraksi tahun menggunakan fungsi helper
        const uniqueYears = [
          ...new Set(data.map((item) => MediaService.extractYear(item))),
        ].sort((a, b) => b - a); // Sort years in descending order

        setYears(uniqueYears);
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0].toString());
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data media. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on active tab, search query, and selected year
  const filteredData = mediaData.filter((item) => {
    // Filter by year
    let matchesYear = true;
    if (selectedYear) {
      // Gunakan fungsi helper untuk ekstraksi tahun
      const itemYear = MediaService.extractYear(item);
      matchesYear = itemYear === selectedYear;
    }

    // Filter by search query
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by type
    const matchesFilter =
      activeTab === "semua" ||
      (activeTab === "foto" && item.tipe === "foto") ||
      (activeTab === "video" && item.tipe === "video") ||
      (activeTab === "dokumen" && item.tipe === "dokumen");

    return matchesYear && matchesSearch && matchesFilter;
  });

  // Get paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Count by type
  const countImages = mediaData.filter((item) => item.tipe === "foto").length;
  const countVideos = mediaData.filter((item) => item.tipe === "video").length;
  const countDocs = mediaData.filter((item) => item.tipe === "dokumen").length;

  // Handle preview
  const handlePreview = (item) => {
    setCurrentItem(item);
    setShowPreviewModal(true);
    setMediaLoading(true);
    setMediaError(false);
  };

  // Get video thumbnail
  const getVideoThumbnail = useCallback((item) => {
    return MediaService.getVideoThumbnail(item);
  }, []);

  // Handle download - perbaikan untuk langsung mengunduh file
  const handleDownload = (e, fileUrl, filename) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Buat elemen anchor tersembunyi
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename || "download"; // Gunakan nama file jika tersedia

      // Penting: jangan gunakan target="_blank" karena bisa menyebabkan masalah "#blocked"
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mengunduh file. Silakan coba lagi.");
    }
  };

  // Render media content based on type
  const renderMediaContent = () => {
    if (!currentItem) return null;
    const mediaUrl = MediaService.getMediaUrl(currentItem.file);

    if (currentItem.tipe === "foto") {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          {mediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
              <FaSpinner className="animate-spin text-4xl text-white" />
            </div>
          )}
          <img
            src={mediaUrl || "/placeholder.svg?height=600&width=800"}
            alt={currentItem.nama}
            className="max-w-full max-h-[70vh] object-contain"
            onLoad={() => setMediaLoading(false)}
            onError={(e) => {
              setMediaLoading(false);
              setMediaError(true);
              e.target.onerror = null;
              e.target.src = "/placeholder.svg?height=600&width=800";
            }}
          />
        </div>
      );
    } else if (currentItem.tipe === "video") {
      return (
        <div className="relative bg-black rounded-lg overflow-hidden">
          {mediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
              <FaSpinner className="animate-spin text-4xl text-white" />
            </div>
          )}
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="w-full max-h-[70vh]"
            poster={getVideoThumbnail(currentItem)}
            onLoadedData={() => setMediaLoading(false)}
            onError={() => {
              setMediaLoading(false);
              setMediaError(true);
            }}
          >
            Browser Anda tidak mendukung pemutaran video.
          </video>
          {mediaError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
              <p className="text-gray-700 mb-4">Video tidak dapat dimuat</p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(mediaUrl, "_blank")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Buka di Tab Baru
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else if (currentItem.tipe === "dokumen") {
      return (
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          {mediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
              <FaSpinner className="animate-spin text-4xl text-white" />
            </div>
          )}
          <iframe
            src={mediaUrl}
            className="w-full h-[70vh]"
            title={currentItem.nama}
            onLoad={() => setMediaLoading(false)}
            onError={() => {
              setMediaLoading(false);
              setMediaError(true);
            }}
          />
          {mediaError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
              <p className="text-gray-700 mb-4">Dokumen tidak dapat dimuat</p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(mediaUrl, "_blank")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Buka di Tab Baru
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
        <FaExclamationTriangle className="text-yellow-500 text-5xl mb-4" />
        <p className="text-gray-700">Format media tidak didukung</p>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col bg-gray-50 min-h-screen mt-20"
      style={{ fontFamily: "poppins" }}
    >
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-9xl font-bold bg-gradient-to-r from-[#6CABCA] to-[#315263] bg-clip-text text-transparent mb-2 py-5">
              Media Digital Desa
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto pt-5">
              Dokumentasi kegiatan dan momen penting desa dalam bentuk foto dan
              video
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Media
                </h3>
                <div className="bg-gray-100 bg-opacity-20 p-2 rounded-lg">
                  <FaPhotoVideo className="text-[#B9FF66] text-xl" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mediaData.length}
              </div>
              <p className="text-sm text-gray-600">Media tersedia</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Foto</h3>
                <div className="bg-gray-100 bg-opacity-20 p-2 rounded-lg">
                  <FaImage className="text-[#FE7C66] text-xl" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {countImages}
              </div>
              <p className="text-sm text-gray-600">Foto tersedia</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Video</h3>
                <div className="bg-gray-100 bg-opacity-20 p-2 rounded-lg">
                  <FaVideo className="text-[#5DE1C4] text-xl" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {countVideos}
              </div>
              <p className="text-sm text-gray-600">Video tersedia</p>
            </div>
          </div>

          {/* Filter and Search */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Year Selection */}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-[#6CABCA]" />
                <span className="text-gray-700 font-medium">Pilih Tahun:</span>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#6CABCA] focus:border-[#6CABCA]"
                  onChange={(e) => setSelectedYear(e.target.value)}
                  value={selectedYear}
                >
                  {years.map((year) => (
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
                  placeholder="Cari media..."
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
                <FaPhotoVideo
                  className={
                    activeTab === "semua" ? "text-gray-800" : "text-[#B9FF66]"
                  }
                />
                <span>Semua Media</span>
              </button>
              <button
                onClick={() => setActiveTab("foto")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === "foto"
                    ? "bg-[#FE7C66] text-white font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaImage
                  className={
                    activeTab === "foto" ? "text-white" : "text-[#FE7C66]"
                  }
                />
                <span>Foto</span>
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === "video"
                    ? "bg-[#5DE1C4] text-white font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaVideo
                  className={
                    activeTab === "video" ? "text-white" : "text-[#5DE1C4]"
                  }
                />
                <span>Video</span>
              </button>
              <button
                onClick={() => setActiveTab("dokumen")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === "dokumen"
                    ? "bg-[#6CABCA] text-white font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaFileAlt
                  className={
                    activeTab === "dokumen" ? "text-white" : "text-[#6CABCA]"
                  }
                />
                <span>Dokumen</span>
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Gallery Media {selectedYear && `Tahun ${selectedYear}`}
                </h2>
                <p className="text-gray-600 text-sm">
                  Dokumentasi kegiatan dan momen penting desa
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
                  onClick={fetchMediaData}
                  className="mt-4 px-4 py-2 bg-[#6CABCA] text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Coba Lagi
                </button>
              </div>
            ) : filteredData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedData.map((media) => (
                    <div
                      key={media.id}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Media Title */}
                      <div className="p-3 border-b">
                        <h3 className="font-medium text-gray-800 truncate">
                          {media.nama}
                        </h3>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FaCalendarAlt />
                            <span>
                              {MediaService.formatDate(media.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            {media.tipe === "foto" ? (
                              <span className="bg-gray-100 bg-opacity-20 text-[#FE7C66] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <FaImage /> Foto
                              </span>
                            ) : media.tipe === "video" ? (
                              <span className="bg-gray-100 bg-opacity-20 text-[#5DE1C4] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <FaVideo /> Video
                              </span>
                            ) : (
                              <span className="bg-gray-100 bg-opacity-20 text-[#6CABCA] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <FaFileAlt /> Dokumen
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Media Thumbnail */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {media.tipe === "foto" ? (
                          <img
                            src={
                              MediaService.getMediaUrl(media.file) ||
                              "/placeholder.svg?height=300&width=400" ||
                              "/placeholder.svg"
                            }
                            alt={media.nama}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "/placeholder.svg?height=300&width=400";
                            }}
                          />
                        ) : media.tipe === "video" ? (
                          <>
                            <img
                              src={
                                getVideoThumbnail(media) ||
                                "/placeholder.svg?height=300&width=400" ||
                                "/placeholder.svg"
                              }
                              alt={media.nama}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/placeholder.svg?height=300&width=400";
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-3 text-white">
                                <FaPlay />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                            <FaFileAlt className="text-[#6CABCA] text-5xl mb-2" />
                            <span className="text-sm text-gray-600">
                              Dokumen PDF
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePreview(media)}
                              className="bg-white p-2 rounded-full shadow-md hover:bg-[#6CABCA] hover:text-white transition-colors"
                              title="Lihat Detail"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDownload(
                                  e,
                                  MediaService.getMediaUrl(media.file),
                                  media.file.split("/").pop()
                                )
                              }
                              className="bg-white p-2 rounded-full shadow-md hover:bg-[#B9FF66] hover:text-gray-800 transition-colors"
                              title="Unduh"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Media Description */}
                      <div className="p-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {media.deskripsi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(currentPage - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &laquo; Prev
                      </button>

                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentPage === index + 1
                              ? "bg-[#6CABCA] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(currentPage + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next &raquo;
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <FaPhotoVideo className="text-gray-300 text-5xl mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada media yang ditemukan</p>
                <p className="text-gray-400 text-sm">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal - Dengan background blur */}
      {showPreviewModal && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowPreviewModal(false)}
          ></div>
          <div
            className="relative w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {currentItem.tipe === "foto" ? (
                  <>
                    <FaImage className="inline-block mr-2 text-[#FE7C66]" />{" "}
                    Foto: {currentItem.nama}
                  </>
                ) : currentItem.tipe === "video" ? (
                  <>
                    <FaVideo className="inline-block mr-2 text-[#5DE1C4]" />{" "}
                    Video: {currentItem.nama}
                  </>
                ) : (
                  <>
                    <FaFileAlt className="inline-block mr-2 text-[#6CABCA]" />{" "}
                    Dokumen: {currentItem.nama}
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaTimesCircle className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {/* Media Content */}
              <div className="mb-4">{renderMediaContent()}</div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-4">{currentItem.deskripsi}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <FaCalendarAlt className="text-[#6CABCA]" />
                    <span className="font-medium">Tanggal:</span>{" "}
                    {MediaService.formatDate(currentItem.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={(e) =>
                    handleDownload(
                      e,
                      MediaService.getMediaUrl(currentItem.file),
                      currentItem.file.split("/").pop()
                    )
                  }
                  className="px-4 py-2 bg-[#B9FF66] text-gray-800 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                >
                  <FaDownload />
                  <span>Unduh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
