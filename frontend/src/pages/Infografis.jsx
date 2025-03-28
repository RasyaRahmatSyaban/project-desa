import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Penduduk from "../components/Infografis/Penduduk";
import APBDes from "../components/Infografis/APBDes";
import Fasilitas from "../components/Infografis/Fasilitas";
import Chart1 from "../assets/chart-1.png";

export default function Infografis() {
  const [activeTab, setActiveTab] = useState("penduduk");

  const renderContent = () => {
    switch (activeTab) {
      case "penduduk":
        return <Penduduk />;
      case "apbdes":
        return <APBDes />;
      // case "fasilitas":
      //   return <Fasilitas />;
      default:
        return <Penduduk />;
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <HeroSection activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Konten Dinamis */}
      <div className="bg-white py-10 px-5 md:px-20 space-y-10 z-10">
        {renderContent()}
      </div>

      <Footer />
    </div>
  );
}

// Hero Section modular
const HeroSection = ({ activeTab, setActiveTab }) => {
  const buttonStyle = (tabName) =>
    `border border-gray-300 font-medium px-5 py-2 md:px-7 md:py-5 max-w-32 rounded-lg shadow-md transition ${
      activeTab === tabName
        ? "bg-lime-400 text-black"
        : "bg-white hover:bg-lime-200 text-black"
    }`;

  return (
    <section className="relative bg-white h-auto px-2 md:px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12 pt-12 md:pt-20">
      {/* ICON */}
      <div className="flex justify-center md:justify-around ">
        <img
          src={Chart1}
          alt="Icon Infografis"
          className="absolute inset-0 left-1 top-24 md:top-0 md:relative w-96 h-96 object-contain z-0 opacity-50 md:opacity-100"
        />
      </div>

      {/* KETERANGAN DAN BUTTON */}
      <div className="text-center max-w-lg z-10">
        <h2
          className="text-[28px] md:text-4xl font-bold md:leading-snug leading-none bg-gradient-to-t from-gray-600 to-gray-300 bg-clip-text text-transparent"
          style={{ fontFamily: "poppins" }}
        >
          Halaman ini menyajikan informasi dalam bentuk visual infografis
        </h2>

        <p
          className="text-gray-600 text-md md:text-lg mt-4"
          style={{ fontFamily: "poppins" }}
        >
          Ketahui berbagai informasi tentang desa Bahontobungku dengan tampilan
          yang menarik
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            className={buttonStyle("penduduk")}
            onClick={() => setActiveTab("penduduk")}
          >
            Penduduk
          </button>
          <button
            className={buttonStyle("apbdes")}
            onClick={() => setActiveTab("apbdes")}
          >
            APBDes
          </button>
          {/* <button
            className={buttonStyle("fasilitas")}
            onClick={() => setActiveTab("fasilitas")}
          >
            Fasilitas
          </button> */}
        </div>
      </div>
    </section>
  );
};
