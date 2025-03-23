"use client";

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import PengumumanService from "../pages/admin/services/PengumumanService";

export default function Pengumuman() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch active announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await PengumumanService.getActivePengumuman();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Gagal memuat pengumuman");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    // Refresh announcements every 5 minutes
    const intervalId = setInterval(fetchAnnouncements, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Rotate through multiple announcements if available
  useEffect(() => {
    if (announcements.length > 1) {
      const rotationInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 15000); // Switch to next announcement every 15 seconds

      return () => clearInterval(rotationInterval);
    }
  }, [announcements.length]);

  // Get current announcement text or use placeholder
  let announcementText;
  let announcementTitle = "";

  if (!loading && announcements.length === 0) {
    announcementText =
      "Saat ini belum ada pengumuman tersedia, tetap pantau informasi terkait pengumuman desa pada website ini untuk mendapatkan informasi terbaru!";
  } else if (announcements.length > 0) {
    const currentAnnouncement = announcements[currentIndex];
    announcementText = currentAnnouncement?.isi || "";
    announcementTitle = currentAnnouncement?.judul
      ? `${currentAnnouncement.judul}: `
      : "";
  }

  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-30
                 bg-gray-800 text-white py-3 px-4 rounded-xl shadow-lg
                 w-[96%] md:max-w-9xl flex items-center gap-3 overflow-hidden"
      style={{ fontFamily: "Poppins" }}
    >
      {/* Icon 📢 */}
      <div className="flex-shrink-0 absolute z-10 inset-0 bg-gray-800 top-2 w-fit px-3">
        <span className="text-2xl">📢</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="ml-10 text-sm md:text-base">Memuat pengumuman...</div>
      ) : (
        /* Teks Berjalan */
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="whitespace-nowrap z-0 ml-10"
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            exit={{ opacity: 0 }}
            transition={{
              duration: Math.max(12, announcementText.length / 20),
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <p className="text-sm md:text-base">
              ⚠{" "}
              {announcements.length > 0
                ? `${announcementTitle}${announcementText}`
                : announcementText}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
