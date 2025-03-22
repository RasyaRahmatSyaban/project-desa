"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Ketua from "../../assets/KetuaBPD.jpg";
import Sekertaris from "../../assets/SekertarisBPD.jpg";
import KasiPelayanan from "../../assets/KasiPelayanan.jpg";
import KaurKeuangan from "../../assets/kaurkeuangan.jpg";
import KepDus1 from "../../assets/KepDus1.jpg";
import KepDus2 from "../../assets/KepDus2.jpg";

const aparatur = [
  {
    name: "",
    tugas: "Ketua BPD",
    image: Ketua,
  },
  {
    name: "",
    tugas: "Sekertaris BPD",
    image: Sekertaris,
  },
  {
    name: "",
    tugas: "Kasi Pelayanan dan Kesejahteraan",
    image: KasiPelayanan,
  },
  {
    name: "",
    tugas: "Kaur Keuangan",
    image: KaurKeuangan,
  },
  {
    name: "",
    tugas: "Kepala Dusun 1",
    image: KepDus1,
  },
  {
    name: "",
    tugas: "Kepala Dusun 2",
    image: KepDus2,
  },
];

export default function CarouselAparatur() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % aparatur.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + aparatur.length) % aparatur.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Calculate visible slides
  const getVisibleSlides = () => {
    const slides = [];
    const totalSlides = aparatur.length;

    // Previous slide (or wrap around)
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    slides.push({ index: prevIndex, position: "left" });

    // Current slide
    slides.push({ index: currentIndex, position: "center" });

    // Next slide (or wrap around)
    const nextIndex = (currentIndex + 1) % totalSlides;
    slides.push({ index: nextIndex, position: "right" });

    return slides;
  };

  const visibleSlides = getVisibleSlides();

  return (
    <div
      className="relative w-full max-w-7xl mx-auto pt-28 px-4 md:px-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative h-[25rem] bg-gray-50 rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Carousel container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Visible slides */}
          {visibleSlides.map(({ index, position }) => {
            const item = aparatur[index];
            const isCenter = position === "center";

            // Calculate styles based on position
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
                key={index}
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
                    src={item.image || "/placeholder.svg"}
                    alt={item.tugas}
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
                      <p className="font-semibold">{item.tugas}</p>
                      {item.name && <p className="text-sm">{item.name}</p>}
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
              key={index}
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

      {/* Title and description below carousel */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          {aparatur[currentIndex].tugas}
        </h2>
        {aparatur[currentIndex].name && (
          <p className="text-gray-600 mt-2">{aparatur[currentIndex].name}</p>
        )}
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Aparatur desa yang bertugas melayani masyarakat dan memastikan
          pelaksanaan program pembangunan desa berjalan dengan baik.
        </p>
      </div>
    </div>
  );
}
