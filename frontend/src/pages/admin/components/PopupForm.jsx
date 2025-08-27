"use client";
import { FaUserPlus, FaTimes } from "react-icons/fa";
import { useState, useEffect , useRef} from "react";
import PendudukService from "../services/PendudukService";

// Helper untuk format tanggal ke yyyy-MM-dd
function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Kalau bukan, baru coba parse ke Date
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
  fetchKepalaKeluarga, // pastikan prop ini diteruskan dari parent
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingKepalaKeluarga, setPendingKepalaKeluarga] = useState(null);
  const [isFetchingKepalaKeluarga, setIsFetchingKepalaKeluarga] =
    useState(false);
  const [searchKK, setSearchKK] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const statusOptions = ["Istri", "Anak", "Mertua", "Cucu", "Menantu"];

  // Reset searchKK saat formData.kepalaKeluarga berubah (form dibuka ulang)
  useEffect(() => {
    setSearchKK("");
  }, [formData.kepalaKeluarga]);

  // Listen perubahan kepalaKeluargaList, reset selectedKK jika tidak valid atau sama dengan nik sendiri
  useEffect(() => {
    if (
      !formData.kepalaKeluarga &&
      formData.selectedKK &&
      kepalaKeluargaList.find(
        (kk) => kk.id === formData.selectedKK && kk.nik === formData.nik
      )
    ) {
      handleInputChange({ target: { name: "selectedKK", value: "" } });
    }
  }, [kepalaKeluargaList, formData.nik]);

  useEffect(() => {
    if (formData.tanggalLahir) {
      handleInputChange({
        target: {
          name: "tanggalLahir",
          value: toDateInputValue(formData.tanggalLahir),
        },
      });
    }
  }, [formData.tanggalLahir]);

  // Handler untuk checkbox kepala keluarga
  const handleKepalaKeluargaChange = (e) => {
    const checked = e.target.checked;

    if (checked) {
      handleInputChange({
        target: {
          name: "kepalaKeluarga",
          value: checked,
        },
      });
      handleInputChange({
        target: {
          name: "status",
          value: "Kepala Keluarga",
        },
      });
    } else {
      // Jika sedang edit dan uncheck, tampilkan konfirmasi
      if (isEditing && formData.kepalaKeluarga && !checked) {
        setPendingKepalaKeluarga(false);
        setShowConfirm(true);
      } else {
        handleInputChange({
          target: {
            name: "kepalaKeluarga",
            value: checked,
          },
        });
        handleInputChange({
          target: {
            name: "status",
            value: statusOptions[0],
          },
        });
      }
    }
  };

  // Konfirmasi perubahan status
  const handleConfirm = async (confirm) => {
    setShowConfirm(false);
    if (confirm) {
      setIsFetchingKepalaKeluarga(true);
      // Hapus data kepala keluarga dari tabel kepala keluarga
      try {
        await PendudukService.deleteKepalaKeluargaByNik(formData.nik);
        if (fetchKepalaKeluarga) await fetchKepalaKeluarga(); // refetch dropdown
      } catch (err) {
        alert("Gagal menghapus data kepala keluarga!");
      }
      setIsFetchingKepalaKeluarga(false);
      handleInputChange({ target: { name: "kepalaKeluarga", value: false } });
      handleInputChange({
        target: { name: "status", value: statusOptions[0] },
      });
    } else {
      handleInputChange({ target: { name: "kepalaKeluarga", value: true } });
      handleInputChange({
        target: { name: "status", value: "Kepala Keluarga" },
      });
    }
    setPendingKepalaKeluarga(null);
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
                value={formData.tanggalLahir || ""}
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
                disabled={formData.kepalaKeluarga}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {formData.kepalaKeluarga ? (
                  <option value="Kepala Keluarga">Kepala Keluarga</option>
                ) : (
                  statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))
                )}
              </select>
              {formData.kepalaKeluarga && (
                <p className="text-xs text-gray-500 mt-1">
                  Status otomatis "Kepala Keluarga" karena dipilih sebagai
                  kepala keluarga
                </p>
              )}
            </div>
          </div>

          {/* Tambahkan dropdown kepala keluarga jika bukan kepala keluarga */}
          {!formData.kepalaKeluarga && (
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
                  setIsFocused(true)
                }}
                onFocus={() => setIsFocused(true)} // Mengatur isFocused menjadi true saat input diklik
                onBlur={() => {
                  // Cek apakah elemen yang diklik berada di luar daftar
                  if (!e.relatedTarget || !e.relatedTarget.closest('ul')) {
                    setTimeout(() => setIsFocused(false), 100);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />

              {/* Daftar hasil pencarian/pilihan */}
              {(isFocused) && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {isFetchingKepalaKeluarga ? (
                    <li className="p-2 text-gray-500">Memuat...</li>
                  ) : (
                    kepalaKeluargaList
                      .filter((kk) => kk.nik !== formData.nik)
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
                          onClick={() => {
                            handleInputChange({
                              target: { name: "selectedKK", value: kk.id },
                            });
                            setSearchKK(`${kk.nama} (${kk.nik})`);
                            setIsFocused(false);
                          }}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          {kk.nama} ({kk.nik})
                        </li>
                      ))
                  )}
                  {kepalaKeluargaList.filter((kk) => kk.nik !== formData.nik).filter((kk) => {
                    const q = searchKK.toLowerCase();
                    return kk.nama.toLowerCase().includes(q) || kk.nik.toLowerCase().includes(q);
                  }).length === 0 && (
                    <li className="p-2 text-gray-500">Tidak ada hasil ditemukan</li>
                  )}
                </ul>
              )}
            </div>
          )}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="kepalaKeluarga"
              name="kepalaKeluarga"
              checked={formData.kepalaKeluarga}
              onChange={handleKepalaKeluargaChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="kepalaKeluarga"
              className="ml-2 block text-sm text-gray-700"
            >
              Kepala Keluarga
            </label>
          </div>

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
        {/* Modal konfirmasi */}
        {showConfirm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <p className="mb-4">
                Yakin ingin mengubah status kepala keluarga? Data kepala
                keluarga akan dihapus.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Ya, Ubah
                </button>
                <button
                  onClick={() => handleConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupForm;
