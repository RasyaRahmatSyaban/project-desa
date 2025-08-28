"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
  FaNewspaper,
} from "react-icons/fa";
import BeritaService from "./user/BeritaService";

const BeritaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First try to get from localStorage (if navigated from Information page)
        const storedBerita = localStorage.getItem("selectedBerita");

        if (storedBerita) {
          const parsedBerita = JSON.parse(storedBerita);
          if (parsedBerita.id.toString() === id) {
            setBerita(parsedBerita);
            setIsLoading(false);
            return;
          }
        }

        // If not in localStorage or ID doesn't match, fetch from API
        const data = await BeritaService.getBeritaById(id);
        if (!data) {
          setError("Berita tidak ditemukan");
        } else {
          setBerita(data);
        }
      } catch (err) {
        console.error("Error fetching berita:", err);
        setError("Gagal memuat data berita. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBerita();
    } else {
      // If no ID is provided, try to get from localStorage
      const storedBerita = localStorage.getItem("selectedBerita");
      if (storedBerita) {
        setBerita(JSON.parse(storedBerita));
        setIsLoading(false);
      } else {
        setError("Berita tidak ditemukan");
        setIsLoading(false);
      }
    }
  }, [id]);

  return (
    <div style={{ fontFamily: "poppins" }}>
      <Navbar />
      <div className="my-4 md:mx-40 pt-20 px-4 md:px-0">
        <div className="mb-6">
          <button
            onClick={() => navigate("/Information")}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Kembali ke daftar berita
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-gray-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-20">
            <FaExclamationTriangle className="text-4xl text-yellow-500 mb-2" />
            <p className="text-gray-600">{error}</p>
          </div>
        ) : berita ? (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold">{berita.judul}</h1>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  <FaCalendarAlt className="inline mr-2" />
                  {BeritaService.formatDate(berita.tanggalTerbit)}
                </span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  <FaUser className="inline mr-2" />
                  {berita.penulis}
                </span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  <FaTag className="inline mr-2" />
                  {berita.kategori || "Umum"}
                </span>
              </div>
            </div>

            <div className="mb-8">
              {berita.foto ? (
                <img
                  src={
                    BeritaService.getImageUrl(berita.foto) || "/placeholder.svg"
                  }
                  alt={berita.judul}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                  <FaNewspaper className="text-gray-400 text-5xl" />
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{berita.isi}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">Berita tidak ditemukan</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BeritaDetail;
