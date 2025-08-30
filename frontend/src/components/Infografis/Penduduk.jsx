"use client";

import { useState, useEffect } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import Ilustrasi from "../../assets/Ilustrasi.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ArrowUpRight } from "lucide-react";
import PendudukServiceUser from "../../services/user/PendudukServiceUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Penduduk() {
  // State untuk data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    summary: {
      totalPenduduk: 0,
      totalKepalaKeluarga: 0,
      totalLakiLaki: 0,
      totalPerempuan: 0,
    },
    byAgama: [],
    byUmur: [],
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PendudukServiceUser.getAllStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data penduduk. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  // Data untuk kartu info
  const infoCards = [
    {
      title: "Total Penduduk",
      count: stats.summary.totalPenduduk,
      color: "#6CABCA",
    },
    {
      title: "Kepala Keluarga",
      count: stats.summary.totalKepalaKeluarga,
      color: "#FE7C66",
    },
    {
      title: "Laki-laki",
      count: stats.summary.totalLakiLaki,
      color: "#5DE1C4",
    },
    {
      title: "Perempuan",
      count: stats.summary.totalPerempuan,
      color: "#13D813",
    },
  ];

  // Prepare chart data
  const prepareUmurData = () => {
    if (!stats.byUmur || stats.byUmur.length === 0) {
      return {
        labels: ["Belum ada data"],
        datasets: [
          {
            label: "Jumlah",
            data: [0],
            backgroundColor: "rgba(54, 162, 235, 0.7)",
          },
        ],
      };
    }

    return {
      labels: stats.byUmur.map((item) => item.kategori),
      datasets: [
        {
          label: "Jumlah",
          data: stats.byUmur.map((item) => item.total),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
      ],
    };
  };

  const prepareAgamaData = () => {
    if (!stats.byAgama || stats.byAgama.length === 0) {
      return {
        labels: ["Belum ada data"],
        datasets: [
          {
            data: [0],
            backgroundColor: ["#B9FF66"],
          },
        ],
      };
    }

    const colors = ["#B9FF66", "#FE7C66", "#5DE1C4", "#6CABCA", "#FFCE56"];

    return {
      labels: stats.byAgama.map((item) => item.agama),
      datasets: [
        {
          data: stats.byAgama.map((item) => item.total),
          backgroundColor: stats.byAgama.map(
            (_, index) => colors[index % colors.length]
          ),
        },
      ],
    };
  };

  const prepareJenisKelaminData = () => {
    return {
      labels: ["Laki-laki", "Perempuan"],
      datasets: [
        {
          data: [stats.summary.totalLakiLaki, stats.summary.totalPerempuan],
          backgroundColor: ["#5DE1C4", "#FE7C66"],
        },
      ],
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <section className="relative space-y-10 z-10">
      {/* Deskripsi dan Kartu Total Penduduk */}
      <div>
        {/* Deskripsi */}
        <h2 className="text-lg md:text-2xl m-5 max-w-200">
          <span className="font-bold bg-yellow-300 px-1 rounded md:flex flex-col w-fit hidden">
            Demografi Penduduk.
          </span>
          <span
            className="text-gray-700 md:flex hidden"
            style={{ fontFamily: "poppins" }}
          >
            Memberikan informasi lengkap mengenai karakteristik demografi
            penduduk desa Bahontobungku.
          </span>
        </h2>

        {/* Kartu */}
        <div className="bg-white rounded-3xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoCards.map((item, idx) => (
              <div
                key={idx}
                className={`
                  rounded-3xl
                  p-4
                  flex
                  flex-col
                  justify-between
                  relative
                  overflow-hidden
                  shadow-md
                  transition-all
                  duration-300
                  ease-in-out
                  border-2
                  border-black
                  hover:shadow-[5px_5px_0px_black]
                  hover:-translate-x-1
                  hover:-translate-y-1
                `}
                style={{ backgroundColor: item.color }}
              >
                {/* Content */}
                <div className="z-10 space-y-3">
                  <div
                    className="bg-white inline-block px-3 py-1 rounded-lg text-lg md:text-3xl font-semibold"
                    style={{ fontFamily: "Space Grotesk" }}
                  >
                    {item.title}
                  </div>
                  <div className="text-white font-bold text-2xl">
                    {item.count} Orang
                  </div>
                </div>

                {/* Background Illustration */}
                <div className="absolute top-0 right-0 opacity-40">
                  <img
                    src={Ilustrasi || "/placeholder.svg"}
                    alt="Icon Infografis"
                    className="w-40 h-40 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 1 - Kelompok Umur */}
        <div className="bg-white shadow-lg rounded-3xl p-5 border border-gray-300">
          <h3
            className="font-bold text-xl bg-yellow-300 px-1 rounded mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            Berdasarkan Kelompok Umur
          </h3>
          <div className="w-full max-w-4xl mx-auto">
            <Bar
              data={prepareUmurData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
              height={250}
            />
          </div>
        </div>

        {/* Chart 2 - Jenis Kelamin (Menggantikan Pekerjaan) */}
        <div className="bg-white shadow-lg rounded-3xl p-5 border border-gray-300">
          <h3
            className="font-bold text-xl bg-yellow-300 px-1 rounded mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            Berdasarkan Jenis Kelamin
          </h3>
          <div className="w-full max-w-3xl mx-auto">
            <Doughnut
              data={prepareJenisKelaminData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
              height={250}
            />
          </div>
        </div>

        {/* Chart 3 - Keyakinan */}
        <div className="bg-white shadow-lg rounded-3xl p-5 border border-gray-300">
          <h3
            className="font-bold text-xl bg-yellow-300 px-1 rounded mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            Berdasarkan Keyakinan
          </h3>
          <div className="w-full max-w-3xl mx-auto">
            <Pie
              data={prepareAgamaData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
              height={250}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
