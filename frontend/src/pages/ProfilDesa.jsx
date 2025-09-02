"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarouselVisiMisi from "../components/ProfilDesa/CarouselVisiMisi";
import CarouselAparatur from "../components/ProfilDesa/CarouselProfil";
import Bg from "../assets/Background.jpg";
import placeholder from "../assets/ph.jpg";

const images = [Bg, placeholder]; // Ganti dengan path gambar yang sesuai

export default function ProfilDesa() {
  return (
    <div>
      <Navbar />
      <InformasiWilayah />

      {/* Visi & Misi */}
      <CarouselVisiMisi id="VisiMisi" />

      {/* Perangkat Desa */}
      <CarouselAparatur />
      <Footer />
    </div>
  );

  function InformasiWilayah() {
    const [index, setIndex] = useState(0);
    const images = [Bg, placeholder];

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Ganti gambar setiap 5 detik
      return () => clearInterval(interval);
    }, []);

    return (
      <section className="relative min-h-[20rem] sm:min-h-[30rem] md:min-h-[45rem] overflow-hidden">
        {/* Slideshow Background */}
        <AnimatePresence>
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[index]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 md:bg-black/30 flex flex-col justify-center text-white px-4 sm:px-8">
          <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl space-y-3 md:space-y-6">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Informasi Wilayah
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-justify leading-relaxed">
              Secara Geografis Desa Bahontobungku terletak pada wilayah
              administrasi Kecamatan Bungku Tengah, dengan perkiraan titik
              kordinat berada pada:
            </p>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <p className="bg-black/30 px-3 py-1 rounded-md text-sm sm:text-base">
                <span className="font-medium">Bujur Timur:</span> 121° 956690"
              </p>
              <p className="bg-black/30 px-3 py-1 rounded-md text-sm sm:text-base">
                <span className="font-medium">Lintang Selatan:</span> -2,649603"
              </p>
            </div>

            <Link
              to="/Map"
              className="inline-block bg-[#16BE27] text-sm sm:text-lg md:text-xl rounded-lg px-4 py-2 md:px-6 md:py-3 font-bold text-gray-700 hover:bg-[#14a924] transition-colors"
            >
              Lihat Selengkapnya
            </Link>
          </div>
        </div>
      </section>
    );
  }
}
