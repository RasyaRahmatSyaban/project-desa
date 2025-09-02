"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AparatServiceUSer from "../../services/user/AparatServiceUser"; // Sesuaikan path

export default function CarouselAparatur() {
  const [aparatur, setAparatur] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari API menggunakan AparatService (user)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await AparatServiceUSer.getAllAparat();

        const formattedData = AparatServiceUSer.formatAparatData(data);

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
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[20rem] sm:h-[25rem] md:h-[28rem] flex items-center justify-center">
        {visibleSlides.map(({ index, position, key }) => {
          const item = aparatur[index];
          if (!item) return null;

          const isCenter = position === "center";

          let translateX = 0;
          let zIndex = 10;
          let opacity = 1;
          let scale = 1;

          if (position === "left") {
            translateX = -150;
            if (window.innerWidth >= 640) translateX = -200; // sm
            if (window.innerWidth >= 1024) translateX = -250; // lg
            zIndex = 5;
            opacity = 0.6;
            scale = 0.85;
          } else if (position === "right") {
            translateX = 150;
            if (window.innerWidth >= 640) translateX = 200;
            if (window.innerWidth >= 1024) translateX = 250;
            zIndex = 5;
            opacity = 0.6;
            scale = 0.85;
          }

          return (
            <div
              key={key}
              className="absolute transition-transform duration-700 ease-in-out cursor-pointer"
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                zIndex,
                opacity,
              }}
              onClick={() => !isCenter && goToSlide(index)}
            >
              <div
                className="relative 
                  w-full max-w-[40vw]
                  sm:w-[200px] md:w-[240px] lg:w-[260px] 
                  aspect-[3/4] 
                  rounded-xl overflow-hidden shadow-lg 
                  bg-white border border-gray-200"
              >
                <img
                  src={item.foto}
                  alt={item.jabatan || "Aparatur"}
                  className="w-full h-full object-cover object-top"
                />
                {isCenter && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white text-center bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-semibold capitalize text-sm sm:text-base">
                      {item.jabatan || "Jabatan"}
                    </p>
                    <p className="text-xs sm:text-sm">{item.nama || "Nama"}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100"
        onClick={prevSlide}
      >
        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
      </button>
      <button
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100"
        onClick={nextSlide}
      >
        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
