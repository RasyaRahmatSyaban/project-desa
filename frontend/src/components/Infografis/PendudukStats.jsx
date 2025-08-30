"use client";

import { useEffect, useState } from "react";
import PendudukServiceUser from "../../services/user/PendudukServiceUser";

export default function PendudukStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalPenduduk: 0,
    totalKepalaKeluarga: 0,
    totalLakiLaki: 0,
    totalPerempuan: 0,
  });
  const [byAgama, setByAgama] = useState([]);
  const [byUmur, setByUmur] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const { summary, byAgama, byUmur } = await PendudukServiceUser.getAllStats();
        setSummary(summary || {});
        setByAgama(Array.isArray(byAgama) ? byAgama : []);
        setByUmur(Array.isArray(byUmur) ? byUmur : []);
      } catch (err) {
        console.error("Failed to fetch penduduk stats:", err);
        setError("Gagal memuat statistik penduduk. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-3xl p-6 shadow-md text-center">
        <p className="text-gray-600">Memuat statistik penduduk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-3xl p-6 shadow-md text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Ringkasan */}
      <div className="bg-white rounded-3xl p-6 shadow-md">
        <h3 className="font-bold text-xl mb-4" style={{ fontFamily: "Poppins" }}>
          Ringkasan Penduduk
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Penduduk" value={summary.totalPenduduk} color="bg-[#6CABCA]" />
          <StatCard label="Kepala Keluarga" value={summary.totalKepalaKeluarga} color="bg-[#B9FF66]" />
          <StatCard label="Laki-laki" value={summary.totalLakiLaki} color="bg-[#5DE1C4]" />
          <StatCard label="Perempuan" value={summary.totalPerempuan} color="bg-[#FE7C66]" />
        </div>
      </div>

      {/* Distribusi Agama dan Kelompok Umur */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agama */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-xl mb-4" style={{ fontFamily: "Poppins" }}>
            Distribusi Berdasarkan Agama
          </h3>
          {byAgama.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="py-2">Agama</th>
                  <th className="py-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byAgama.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2 pr-4">{row.agama || row.nama || "-"}</td>
                    <td className="py-2 text-right font-medium">{row.jumlah ?? row.total ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Tidak ada data agama.</p>
          )}
        </div>

        {/* Umur */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-xl mb-4" style={{ fontFamily: "Poppins" }}>
            Distribusi Berdasarkan Kelompok Umur
          </h3>
          {byUmur.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="py-2">Kelompok Umur</th>
                  <th className="py-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byUmur.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2 pr-4">{row.kelompok || row.range || row.kategori || "-"}</td>
                    <td className="py-2 text-right font-medium">{row.jumlah ?? row.total ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Tidak ada data umur.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      className={`rounded-2xl p-4 border-2 border-black shadow-md hover:shadow-[5px_5px_0px_black] transition-all ${color}`}
    >
      <div className="bg-white inline-block px-3 py-1 rounded-lg text-base md:text-lg font-semibold mb-2 text-gray-800">
        {label}
      </div>
      <div className="text-white font-bold text-2xl">{Number(value || 0).toLocaleString("id-ID")}</div>
    </div>
  );
}
