"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AparatServiceAdmin from "../../pages/admin/services/AparatServiceAdmin"; // Sesuaikan path

export default function CarouselAparatur() {
  const [aparatur, setAparatur] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API menggunakan AparatServiceAdmin
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await AparatServiceAdmin.getAllAparat();

        const formattedData = AparatServiceAdmin.formatAparatData(data);

        setAparatur(formattedData);
      } catch (error) {
        console.error("Gagal memuat data aparatur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Autoplay
  useEffect(() => {
    if (isAutoPlaying && !isHovered && aparatur.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % aparatur.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered, isAutoPlaying, aparatur.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % aparatur.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + aparatur.length) % aparatur.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getVisibleSlides = () => {
    const slides = [];
    const total = aparatur.length;

    if (total === 0) return [];

    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    slides.push({
      index: prevIndex,
      position: "left",
      key: `left-${prevIndex}`,
    });
    slides.push({
      index: currentIndex,
      position: "center",
      key: `center-${currentIndex}`,
    });
    slides.push({
      index: nextIndex,
      position: "right",
      key: `right-${nextIndex}`,
    });

    return slides;
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 animate-pulse">
        Memuat data aparatur...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error}
        <br />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Empty state
  if (aparatur.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Tidak ada data aparatur ditemukan.
      </div>
    );
  }

  const visibleSlides = getVisibleSlides();

  return (
    <div
      className="relative w-full max-w-7xl mx-auto pt-28 px-4 md:px-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative h-[25rem] bg-gray-50 rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)" }}
      >
        {/* Slides */}
        <div className="absolute inset-0 flex items-center justify-center">
          {visibleSlides.map(({ index, position, key }) => {
            const item = aparatur[index];
            if (!item) return null;

            const isCenter = position === "center";

            let translateX = 0;
            let zIndex = 10;
            let opacity = 1;
            let scale = 1;
            let blur = 0;

            if (position === "left") {
              translateX = -280;
              zIndex = 5;
              opacity = 0.7;
              scale = 0.85;
              blur = 3;
            } else if (position === "right") {
              translateX = 280;
              zIndex = 5;
              opacity = 0.7;
              scale = 0.85;
              blur = 3;
            }

            return (
              <div
                key={key} // Menggunakan key yang unik berdasarkan posisi dan index
                className="absolute transition-all duration-500 ease-in-out cursor-pointer"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                onClick={() => !isCenter && goToSlide(index)}
              >
                <div
                  className="relative overflow-hidden rounded-lg"
                  style={{
                    width: "220px",
                    height: "300px",
                    boxShadow: isCenter
                      ? "0 10px 25px rgba(0, 0, 0, 0.15)"
                      : "0 5px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={item.foto}
                    alt={item.jabatan || "Aparatur"}
                    className="w-full h-full object-cover"
                  />
                  {isCenter && (
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 text-white text-center"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                      }}
                    >
                      <p className="font-semibold capitalize">
                        {item.jabatan || "Jabatan"}
                      </p>
                      <p className="text-sm">{item.nama || "Nama"}</p>
                      {item.nip && (
                        <p className="text-xs opacity-75">NIP: {item.nip}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 bg-white/80 rounded-full px-3 py-2 shadow-sm">
          {aparatur.map((_, index) => (
            <button
              key={`indicator-${index}`} // Key unik untuk setiap indicator
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
