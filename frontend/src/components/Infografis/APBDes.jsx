"use client";

import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
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
import APBDesService from "../../services/admin/APBDesService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function APBDes() {
  // State untuk data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [detailData, setDetailData] = useState({
    pendapatan: [],
    pengeluaran: [],
  });

  // Fetch data on component mount and when selected year changes
  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchData(selectedYear);
    }
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      const years = await APBDesService.getAvailableYears();
      setAvailableYears(years);

      // Set default selected year to the most recent year or current year
      if (years.length > 0) {
        setSelectedYear(years[0]);
      } else {
        setSelectedYear(new Date().getFullYear());
      }
    } catch (err) {
      console.error("Error fetching available years:", err);
      setError("Gagal memuat data tahun. Silakan coba lagi nanti.");
    }
  };

  const fetchData = async (year) => {
    setIsLoading(true);
    setError(null);
    try {
      const [summary, detail] = await Promise.all([
        APBDesService.getAPBDesSummary(year),
        APBDesService.getAPBDesDetail(year),
      ]);
      setSummaryData(summary);
      setDetailData(detail);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data APBDes. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total income and expense
  const getTotalIncome = () => {
    const income = summaryData.find((item) => item.tipe === "Pemasukan");
    return income ? income.total : 0;
  };

  const getTotalExpense = () => {
    const expense = summaryData.find((item) => item.tipe === "Pengeluaran");
    return expense ? expense.total : 0;
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  // Prepare chart data
  const preparePieChartData = () => {
    return {
      labels: ["Pendapatan", "Pengeluaran"],
      datasets: [
        {
          data: [getTotalIncome(), getTotalExpense()],
          backgroundColor: ["#5DE1C4", "#FE7C66"],
          borderColor: ["#5DE1C4", "#FE7C66"],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareBarChartData = () => {
    // Create an array of all months (1-12)
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Map income data by month
    const incomeByMonth = new Map();
    detailData.pendapatan.forEach((item) => {
      incomeByMonth.set(Number.parseInt(item.bulan), item.total);
    });

    // Map expense data by month
    const expenseByMonth = new Map();
    detailData.pengeluaran.forEach((item) => {
      expenseByMonth.set(Number.parseInt(item.bulan), item.total);
    });

    // Prepare data for chart
    const incomeData = months.map((month) => incomeByMonth.get(month) || 0);
    const expenseData = months.map((month) => expenseByMonth.get(month) || 0);

    return {
      labels: months.map((month) => APBDesService.getMonthName(month)),
      datasets: [
        {
          label: "Pendapatan",
          data: incomeData,
          backgroundColor: "rgba(93, 225, 196, 0.7)",
          borderColor: "rgba(93, 225, 196, 1)",
          borderWidth: 1,
        },
        {
          label: "Pengeluaran",
          data: expenseData,
          backgroundColor: "rgba(254, 124, 102, 0.7)",
          borderColor: "rgba(254, 124, 102, 1)",
          borderWidth: 1,
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
          onClick={() => fetchData(selectedYear)}
          className="mt-4 px-4 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <section className="relative space-y-10 z-10">
      {/* Deskripsi dan Dropdown Tahun */}
      <div>
        <h2 className="text-lg md:text-2xl m-5 max-w-200">
          <span className="font-bold bg-yellow-300 px-1 rounded md:flex flex-col w-fit hidden">
            APBDes.
          </span>
          <span className="text-gray-700" style={{ fontFamily: "poppins" }}>
            Memberikan informasi lengkap mengenai anggaran pendapatan dan
            belanja desa Bahontobungku.
          </span>
        </h2>

        {/* Dropdown Tahun */}
        <div className="bg-white rounded-3xl p-5 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Kartu Ringkasan */}
        <div className="bg-white rounded-3xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pendapatan */}
            <div
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
                bg-[#5DE1C4]
              `}
            >
              <div className="z-10 space-y-3">
                <div
                  className="bg-white inline-block px-3 py-1 rounded-lg text-lg md:text-3xl font-semibold"
                  style={{ fontFamily: "Space Grotesk" }}
                >
                  Pendapatan
                </div>
                <div className="text-white font-bold text-2xl">
                  {APBDesService.formatCurrency(getTotalIncome())}
                </div>
                <button className="flex items-center gap-1 text-white hover:underline">
                  Detail <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* Pengeluaran */}
            <div
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
                bg-[#FE7C66]
              `}
            >
              <div className="z-10 space-y-3">
                <div
                  className="bg-white inline-block px-3 py-1 rounded-lg text-lg md:text-3xl font-semibold"
                  style={{ fontFamily: "Space Grotesk" }}
                >
                  Pengeluaran
                </div>
                <div className="text-white font-bold text-2xl">
                  {APBDesService.formatCurrency(getTotalExpense())}
                </div>
                <button className="flex items-center gap-1 text-white hover:underline">
                  Detail <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* Saldo */}
            <div
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
                bg-[#6CABCA]
              `}
            >
              <div className="z-10 space-y-3">
                <div
                  className="bg-white inline-block px-3 py-1 rounded-lg text-lg md:text-3xl font-semibold"
                  style={{ fontFamily: "Space Grotesk" }}
                >
                  Saldo
                </div>
                <div className="text-white font-bold text-2xl">
                  {APBDesService.formatCurrency(getBalance())}
                </div>
                <button className="flex items-center gap-1 text-white hover:underline">
                  Detail <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 - Pie Chart */}
        <div className="bg-white shadow-lg rounded-3xl p-5 border border-gray-300">
          <h3
            className="font-bold text-xl bg-yellow-300 px-1 rounded mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            Perbandingan Pendapatan dan Pengeluaran
          </h3>
          <div className="w-full max-w-md mx-auto">
            <Pie
              data={preparePieChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw;
                        return `${
                          context.label
                        }: ${APBDesService.formatCurrency(value)}`;
                      },
                    },
                  },
                },
              }}
              height={250}
            />
          </div>
        </div>

        {/* Chart 2 - Bar Chart */}
        <div className="bg-white shadow-lg rounded-3xl p-5 border border-gray-300">
          <h3
            className="font-bold text-xl bg-yellow-300 px-1 rounded mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            Pendapatan dan Pengeluaran Bulanan
          </h3>
          <div className="w-full max-w-4xl mx-auto">
            <Bar
              data={prepareBarChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw;
                        return `${
                          context.dataset.label
                        }: ${APBDesService.formatCurrency(value)}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => APBDesService.formatCurrency(value),
                    },
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>

        {/* Tabel Pendapatan */}
        <div className="bg-white shadow-lg rounded-3xl p-5 border border-gray-300 overflow-hidden">
          <h3
            className="font-bold text-xl bg-yellow-300 px-1 rounded mb-6"
            style={{ fontFamily: "Poppins" }}
          >
            Rincian Pendapatan
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-[#5DE1C4]/10 text-left font-semibold text-gray-800 rounded-tl-lg">
                    No
                  </th>
                  <th className="py-3 px-6 bg-[#5DE1C4]/10 text-left font-semibold text-gray-800">
                    Bulan
                  </th>
                  <th className="py-3 px-6 bg-[#5DE1C4]/10 text-right font-semibold text-gray-800 rounded-tr-lg">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detailData.pendapatan.length > 0 ? (
                  detailData.pendapatan.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="py-3 px-6 text-gray-700">{index + 1}</td>
                      <td className="py-3 px-6 text-gray-700 font-medium">
                        {APBDesService.getMonthName(item.bulan)}
                      </td>
                      <td className="py-3 px-6 text-right font-mono font-medium text-green-600">
                        {APBDesService.formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 px-6 text-center text-gray-500 italic"
                    >
                      Tidak ada data pendapatan untuk tahun ini
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={2}
                    className="py-4 px-6 bg-[#5DE1C4]/10 text-right font-bold text-gray-800 rounded-bl-lg"
                  >
                    Total Pendapatan:
                  </td>
                  <td className="py-4 px-6 bg-[#5DE1C4]/10 text-right font-bold font-mono text-green-600 rounded-br-lg">
                    {APBDesService.formatCurrency(getTotalIncome())}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Tabel Pengeluaran */}
        <div className="bg-white shadow-lg rounded-3xl p-5 border border-gray-300 overflow-hidden">
          <h3
            className="font-bold text-xl bg-yellow-300 px-1 rounded mb-6"
            style={{ fontFamily: "Poppins" }}
          >
            Rincian Pengeluaran
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-[#FE7C66]/10 text-left font-semibold text-gray-800 rounded-tl-lg">
                    No
                  </th>
                  <th className="py-3 px-6 bg-[#FE7C66]/10 text-left font-semibold text-gray-800">
                    Bulan
                  </th>
                  <th className="py-3 px-6 bg-[#FE7C66]/10 text-right font-semibold text-gray-800 rounded-tr-lg">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detailData.pengeluaran.length > 0 ? (
                  detailData.pengeluaran.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="py-3 px-6 text-gray-700">{index + 1}</td>
                      <td className="py-3 px-6 text-gray-700 font-medium">
                        {APBDesService.getMonthName(item.bulan)}
                      </td>
                      <td className="py-3 px-6 text-right font-mono font-medium text-red-600">
                        {APBDesService.formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 px-6 text-center text-gray-500 italic"
                    >
                      Tidak ada data pengeluaran untuk tahun ini
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={2}
                    className="py-4 px-6 bg-[#FE7C66]/10 text-right font-bold text-gray-800 rounded-bl-lg"
                  >
                    Total Pengeluaran:
                  </td>
                  <td className="py-4 px-6 bg-[#FE7C66]/10 text-right font-bold font-mono text-red-600 rounded-br-lg">
                    {APBDesService.formatCurrency(getTotalExpense())}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </section>
  );
}
