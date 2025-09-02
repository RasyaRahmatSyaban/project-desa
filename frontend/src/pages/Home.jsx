import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Bg from "../assets/bg-bahontobungku.jpg";
import Pengumuman from "../components/Pengumuman";
import Card from "../components/CardTemplate";
import { BookOpen, Bell, Users, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ fontFamily: "poppins" }}>
      <Navbar />
      <div className="relative">
        {" "}
        {/* Hero dibungkus relative agar pengumuman bisa absolute */}
        <HeroSection />
        <Pengumuman /> {/* Ditempel tepat di batas Hero */}
      </div>
      <InfoSection />
      <Footer />
    </div>
  );
}

const HeroSection = () => {
  return (
    <section
      className="py-8 px-4 md:px-8 pt-24 pb-11"
      style={{ fontFamily: "Poppins" }}
    >
      <div
        className="relative w-full max-w-9xl h-[40rem] md:h-[37rem] bg-cover bg-center rounded-3xl overflow-hidden mx-auto shadow-xl"
        style={{ backgroundImage: `url(${Bg})` }}
      >
        {/* Overlay gradient yang lebih menarik */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        {/* Elemen dekoratif */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-400 opacity-80"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <div className="animate-fadeIn">
            <h2 className="text-[2.5rem] md:text-[5rem] font-bold mb-2 md:mb-4 tracking-tight text-shadow-lg">
              DESA DIGITAL
            </h2>
            <p className="text-[1.5rem] md:text-[3.5rem] font-bold tracking-wide text-shadow-md">
              BAHONTOBUNGKU
            </p>

            {/* Tambahan deskripsi singkat */}
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-200 leading-relaxed">
              Menuju desa yang modern, transparan, dan berkelanjutan melalui
              transformasi digital
            </p>

            {/* Optional: Tombol CTA */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/ProfilDesa"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Jelajahi
              </a>
              <a
                href="/Pelayanan"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium rounded-full transition-all duration-300 border border-white/30"
              >
                Layanan Desa
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoSection = () => {
  return (
    <div className="relative bg-white md:pt-28 px-5 pt-10">
      {" "}
      {/* Ditambah padding atas agar tidak tabrakan */}
      <div className="block md:flex w-full h-full md:h-[50rem] mx-auto text-center relative">
        {/* SVG Decoration */}
        <svg
          width="1100"
          height="600"
          viewBox="0 0 200 150"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden absolute inset-y-0 top-28 right-0 z-10 md:flex"
        >
          <path
            d="M0,40 A40,40 0 0,1 40,0 H200 V110 A40,40 0 0,1 160,150 H0 Z"
            fill="#F4F9FF"
          />
        </svg>
        {/* Cards */}
        <div className="flex flex-col w-full md:w-2/5 h-full justify-center md:pl-20 relative z-10 px-6">
          <h2 className="w-full md:w-3/4 text-3xl md:text-4xl font-bold text-gray-800 leading-12 text-left">
            Dapatkan Informasi Terbaru terkait desa
          </h2>
          <p className="text-gray-500 mt-3 text-justify md:text-left">
            Desa digital sebagai sarana penunjang kebutuhan informasi dan
            pelayanan masyarakat.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-3/5 md:flex md:flex-row space-x-6 space-y-6 relative z-10">
          <div className="flex flex-col w-1/2 space-y-6 items-center pt-6 md:pt-20 mx-auto">
            <Link to="/Information">
              <Card>
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <BookOpen
                    size={40}
                    strokeWidth={1}
                    className="p-4 mt-4 w-36 h-28 bg-blue-100 rounded-2xl"
                  />
                  <h3 className="text-xl font-semibold mt-3">Berita</h3>
                  <p className="text-gray-500">
                    Baca berbagai berita terbaru tentang desa bahontobungku
                  </p>
                </div>
              </Card>
            </Link>
            <Link to="/ProfilDesa">
              <Card>
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <Users
                    size={40}
                    strokeWidth={1}
                    className="p-4 mt-4 w-36 h-28 bg-yellow-100 rounded-2xl"
                  />
                  <h3 className="text-xl font-semibold mt-3">Aparatur</h3>
                  <p className="text-gray-500">
                    Ketahui profil singkat dari para perangkat pemerintahan desa
                    bahontobungku
                  </p>
                </div>
              </Card>
            </Link>
          </div>
          <div className="flex flex-col w-1/2 space-y-6 items-center">
            <Link to="/Information">
              <Card>
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <Bell
                    size={40}
                    strokeWidth={1}
                    className="p-4 mt-4 w-36 h-28 bg-pink-100 rounded-2xl"
                  />
                  <h3 className="text-xl font-semibold mt-3">Pengumuman</h3>
                  <p className="text-gray-500">
                    Informasi terkait pengumuman untuk masyarakat desa
                    bahontobungku
                  </p>
                </div>
              </Card>
            </Link>
            <Link to="/Infografis">
              <Card>
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <ClipboardList
                    size={40}
                    strokeWidth={1}
                    className="p-4 mt-4 w-36 h-28 bg-green-100 rounded-2xl"
                  />
                  <h3 className="text-xl font-semibold mt-3">Fasilitas</h3>
                  <p className="text-gray-500">
                    Lihat data statistik terkait fasilitas yang ada di desa
                    bahontobungku
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
