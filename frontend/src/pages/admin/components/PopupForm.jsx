"use client";
import { FaUserPlus, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

// Helper untuk format tanggal ke yyyy-MM-dd
function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const PopupForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  resetForm,
  isEditing,
  kepalaKeluargaList = [],
}) => {
  const [searchKK, setSearchKK] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Status options, sekarang 'Kepala Keluarga' akan menjadi opsi default
  const statusOptions = [
    "Kepala Keluarga",
    "Istri",
    "Anak",
    "Mertua",
    "Cucu",
    "Menantu",
  ];

  // Sinkronisasi status dan id_kepalakeluarga saat form data berubah
  useEffect(() => {
    // Jika status adalah "Kepala Keluarga", pastikan id_kepalakeluarga adalah null
    if (formData.status === "Kepala Keluarga") {
      handleInputChange({
        target: { name: "id_kepalakeluarga", value: null },
      });
      setSearchKK("");
    } else if (formData.id_kepalakeluarga) {
      const selectedKK = kepalaKeluargaList.find(
        (kk) => Number(kk.id) === Number(formData.id_kepalakeluarga)
      );
      if (selectedKK) {
        setSearchKK(`${selectedKK.nama} (${selectedKK.nik})`);
      } else {
        setSearchKK("");
      }
    }
  }, [
    formData.status,
    formData.id_kepalakeluarga,
    kepalaKeluargaList,
    handleInputChange,
  ]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    // Handle checkbox terpisah jika diperlukan, atau langsung di handleInputChange
    if (name === "isKepalaKeluarga") {
      const newStatus = checked ? "Kepala Keluarga" : "Istri";
      handleInputChange({ target: { name: "status", value: newStatus } });
      handleInputChange({ target: { name: "id_kepalakeluarga", value: null } });
    } else {
      handleInputChange(e);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaUserPlus className="text-blue-500" size={20} />
            </div>
            <h2 className="font-semibold text-xl text-gray-800">
              {isEditing ? "Edit Data Penduduk" : "Tambah Data Penduduk"}
            </h2>
          </div>
          <button
            onClick={resetForm}
            className="text-gray-500 hover:text-gray-700"
            title="Tutup"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="tanggalLahir"
                name="tanggalLahir"
                value={toDateInputValue(formData.tanggalLahir) || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agama
              </label>
              <select
                name="agama"
                value={formData.agama}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Hindu">Hindu</option>
                <option value="Budha">Budha</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tambahkan dropdown kepala keluarga jika bukan kepala keluarga */}
          {formData.status !== "Kepala Keluarga" && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Kepala Keluarga
              </label>
              {/* Input search kepala keluarga */}
              <input
                type="text"
                ref={inputRef}
                placeholder="Cari nama/NIK kepala keluarga..."
                value={searchKK}
                onChange={(e) => {
                  setSearchKK(e.target.value);
                  setIsFocused(true);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Berikan sedikit delay agar onMouseDown di item list bisa tereksekusi
                  setTimeout(() => setIsFocused(false), 100);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />

              {/* Daftar hasil pencarian/pilihan */}
              {isFocused && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {kepalaKeluargaList
                    .filter((kk) => kk.id !== formData.id) // Mencegah memilih diri sendiri
                    .filter((kk) => {
                      const q = searchKK.toLowerCase();
                      return (
                        kk.nama.toLowerCase().includes(q) ||
                        kk.nik.toLowerCase().includes(q)
                      );
                    })
                    .map((kk) => (
                      <li
                        key={kk.id}
                        onMouseDown={() => {
                          handleInputChange({
                            target: { name: "id_kepalakeluarga", value: kk.id },
                          });
                          setSearchKK(`${kk.nama} (${kk.nik})`);
                          setIsFocused(false);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {kk.nama} ({kk.nik})
                      </li>
                    ))}
                  {kepalaKeluargaList
                    .filter((kk) => kk.id !== formData.id)
                    .filter((kk) => {
                      const q = searchKK.toLowerCase();
                      return (
                        kk.nama.toLowerCase().includes(q) ||
                        kk.nik.toLowerCase().includes(q)
                      );
                    }).length === 0 && (
                    <li className="p-2 text-gray-500">
                      Tidak ada hasil ditemukan
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => resetForm()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isEditing ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
