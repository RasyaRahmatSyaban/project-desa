import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import {
  MapPin,
  Users,
  Mountain,
  Cloud,
  Compass,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
} from "lucide-react";

const GoogleMap = () => {
  const [expandedSection, setExpandedSection] = useState("about");

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div style={{ fontFamily: "poppins" }}>
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-28">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63771.19076395132!2d121.91083535070119!3d-2.6036879708771687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d9a8a4637bf30fb%3A0x9e73ab71db6fa5a6!2sBahontobungku%2C%20Bungku%20Tengah%2C%20Morowali%20Regency%2C%20Central%20Sulawesi!5e0!3m2!1sen!2sid!4v1742593589828!5m2!1sen!2sid"
          width="1480"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="max-w-[96%] rounded-xl shadow-md"
        ></iframe>
        <div className="bg-white w-[96%] mt-10 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-red-500" />
              Bahontobungku
            </h2>
            <p className="text-gray-500 mt-1">
              Bungku Tengah, Kabupaten Morowali, Sulawesi Tengah
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center text-blue-700">
                  <Compass className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">KOORDINAT</span>
                </div>
                <p className="mt-1 text-sm font-mono">-2.605, 121.887</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center text-green-700">
                  <Mountain className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">KETINGGIAN</span>
                </div>
                <p className="mt-1 text-sm">~25m di atas permukaan laut</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* About Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection("about")}
                >
                  <div className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="font-medium">Tentang</span>
                  </div>
                  {expandedSection === "about" ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSection === "about" && (
                  <div className="px-4 py-3 text-sm text-gray-600">
                    <p>
                      Bahontobungku adalah desa yang terletak di kecamatan
                      Bungku Tengah, Kabupaten Morowali, provinsi Sulawesi
                      Tengah, Indonesia. Daerah ini dikenal dengan keindahan
                      alamnya, budaya tradisional, dan merupakan bagian dari
                      wilayah berkembang di Sulawesi.
                    </p>
                    <p className="mt-2">
                      Desa ini dikelilingi oleh lanskap yang subur dan dekat
                      dengan pantai timur Sulawesi Tengah, menawarkan
                      pemandangan indah dan akses ke sumber daya alam.
                    </p>
                  </div>
                )}
              </div>

              {/* Demographics Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection("demographics")}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="font-medium">Demografi</span>
                  </div>
                  {expandedSection === "demographics" ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSection === "demographics" && (
                  <div className="px-4 py-3 text-sm text-gray-600">
                    <p>
                      Populasi Bahontobungku sebagian besar terdiri dari
                      penduduk asli Sulawesi, dengan campuran berbagai kelompok
                      etnis termasuk Bugis, Makassar, dan suku lokal.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-xs text-gray-500">
                          BAHASA UTAMA
                        </span>
                        <p className="font-medium">
                          Bahasa Indonesia, Dialek lokal
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-xs text-gray-500">AGAMA</span>
                        <p className="font-medium">Mayoritas Islam</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Climate Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection("climate")}
                >
                  <div className="flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="font-medium">Iklim</span>
                  </div>
                  {expandedSection === "climate" ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSection === "climate" && (
                  <div className="px-4 py-3 text-sm text-gray-600">
                    <p>
                      Bahontobungku memiliki iklim tropis dengan curah hujan
                      yang signifikan sepanjang tahun, bahkan selama bulan-bulan
                      terkering.
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Suhu Rata-rata</span>
                        <span className="font-medium">26-32°C</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Musim Hujan</span>
                        <span className="font-medium">Nov - Apr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Musim Kemarau</span>
                        <span className="font-medium">Mei - Okt</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visiting Information */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection("visiting")}
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="font-medium">Informasi Kunjungan</span>
                  </div>
                  {expandedSection === "visiting" ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSection === "visiting" && (
                  <div className="px-4 py-3 text-sm text-gray-600">
                    <p>
                      Waktu terbaik untuk mengunjungi Bahontobungku adalah
                      selama musim kemarau dari Mei hingga Oktober ketika cuaca
                      lebih dapat diprediksi dan aktivitas luar ruangan lebih
                      menyenangkan.
                    </p>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Cara Mencapai</p>
                          <p className="text-gray-500">
                            Akses utama melalui bandara Palu atau Makassar,
                            dilanjutkan dengan transportasi darat.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Akomodasi</p>
                          <p className="text-gray-500">
                            Pilihan terbatas namun terus berkembang di kota-kota
                            terdekat dan pusat regional.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GoogleMap;
