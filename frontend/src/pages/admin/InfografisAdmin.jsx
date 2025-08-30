"use client";

import { useState } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaBuilding,
  FaChartPie,
} from "react-icons/fa";
import Penduduk from "../../components/admin/Penduduk";
import APBDes from "../../components/admin/APBDes";
export default function InfografisAdmin() {
  const [activeTab, setActiveTab] = useState("penduduk");

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ fontFamily: "poppins" }}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <FaChartPie className="text-indigo-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Infografis Desa</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("penduduk")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "penduduk"
                  ? "bg-blue-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaUsers
                className={
                  activeTab === "penduduk" ? "text-white" : "text-blue-500"
                }
              />
              <span>Penduduk</span>
            </button>
            <button
              onClick={() => setActiveTab("apbdes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "apbdes"
                  ? "bg-yellow-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaMoneyBillWave
                className={
                  activeTab === "apbdes" ? "text-white" : "text-yellow-500"
                }
              />
              <span>APBDes</span>
            </button>
            {/* <button
              onClick={() => setActiveTab("fasilitas")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "fasilitas"
                  ? "bg-green-500 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaBuilding
                className={
                  activeTab === "fasilitas" ? "text-white" : "text-green-500"
                }
              />
              <span>Fasilitas</span>
            </button> */}
          </div>
        </div>

        <div className="transition-all duration-300">
          {activeTab === "penduduk" && <Penduduk />}
          {activeTab === "apbdes" && <APBDes />}
          {activeTab === "fasilitas" && (
            <div className="bg-white rounded-2xl shadow-md">
              <Fasilitas />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
