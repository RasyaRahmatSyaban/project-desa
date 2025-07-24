"use client"

import { useState, useEffect } from "react"
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import axios from "axios"

const initialForm = {
  id: null,
  nama: "",
  jabatan: "",
  nip: "",
  nohp: "",
  aktif: true,
  foto: "",
  fotoFile: null,
  existingFoto: null, // Tambahan untuk menyimpan foto existing
}

export default function AparatAdmin() {
  const [form, setForm] = useState(initialForm)
  const [aparatList, setAparatList] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // Base URL dan token
  const BASE_URL = "http://localhost:3000"
  const token = localStorage.getItem("token")

  // Axios config
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // Fetch data aparatur
  const fetchAparatur = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/aparatur`, axiosConfig)

      // Cek struktur response
      let dataArray = []

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        dataArray = response.data.data
      } else if (Array.isArray(response.data)) {
        dataArray = response.data
      } else if (response.data && response.data.data) {
        dataArray = Array.isArray(response.data.data) ? response.data.data : [response.data.data]
      } else {
        console.error("Unexpected response structure:", response.data)
        return
      }

      // Mapping data dari API ke format yang digunakan component
      const mappedData = dataArray.map((item) => {
        return {
          id: item.id,
          nama: item.nama || "",
          jabatan: item.jabatan || "",
          nip: item.nip || item.nik || "",
          nohp: item.telepon || item.nohp || item.no_hp || "",
          aktif:
            item.status === 1 ||
            item.status === "1" ||
            item.status === true ||
            item.status === "Aktif" ||
            item.aktif === 1 ||
            item.aktif === "1" ||
            item.aktif === true,
          foto: item.foto ? (item.foto.startsWith("http") ? item.foto : `${BASE_URL}/uploads/${item.foto}`) : "",
        }
      })

      setAparatList(mappedData)
    } catch (error) {
      console.error("Error fetching aparatur:", error)

      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data?.message || "Gagal mengambil data"}`)
      } else if (error.request) {
        console.error("No response received:", error.request)
        alert("Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3000")
      } else {
        console.error("Error message:", error.message)
        alert("Terjadi kesalahan: " + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Load data saat component mount
  useEffect(() => {
    fetchAparatur()
  }, [])

  // Handler input
  const handleInput = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked })
    } else if (type === "file") {
      const file = files[0]
      if (file) {
        setForm({ ...form, fotoFile: file })

        const reader = new FileReader()
        reader.onloadend = () => {
          setForm((prev) => ({ ...prev, foto: reader.result }))
        }
        reader.readAsDataURL(file)
      }
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  // Submit form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi sesuai dengan requirement backend
    if (!form.nama || !form.jabatan || !form.nip || !form.nohp) {
      alert("Nama, jabatan, NIP, dan nomor telepon wajib diisi!")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      // Sesuaikan nama field dengan yang diharapkan backend
      formData.append("nama", form.nama)
      formData.append("jabatan", form.jabatan)
      formData.append("nip", form.nip)
      formData.append("telepon", form.nohp || "")

      // Kirim status sebagai 1 atau 0
      formData.append("status", form.aktif ? "1" : "0")

      // Hanya append foto jika ada file baru yang dipilih
      if (form.fotoFile) {
        formData.append("foto", form.fotoFile)
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }

      let response

      if (isEditing && form.id) {
        response = await axios.put(`${BASE_URL}/aparatur/${form.id}`, formData, config)
      } else {
        response = await axios.post(`${BASE_URL}/aparatur`, formData, config)
      }

      // Reset form dan state
      setForm(initialForm)
      setIsEditing(false)
      setShowForm(false)
      fetchAparatur()
    } catch (error) {
      console.error("Error saving data:", error)

      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data?.message || "Gagal menyimpan data"}`)
      } else {
        alert("Gagal menyimpan data: " + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Edit handler - PERBAIKAN UNTUK MENAMPILKAN FOTO EXISTING
  const handleEdit = (aparat) => {
    const editForm = {
      id: aparat.id,
      nama: aparat.nama || "",
      jabatan: aparat.jabatan || "",
      nip: aparat.nip || "",
      nohp: aparat.nohp || "",
      aktif: aparat.aktif || false,
      foto: aparat.foto || "", // Foto existing untuk preview
      existingFoto: aparat.foto || "", // Simpan foto existing
      fotoFile: null, // Reset file input
    }

    setForm(editForm)
    setIsEditing(true)
    setShowForm(true)
  }

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus aparat ini?")) return

    try {
      setLoading(true)
      await axios.delete(`${BASE_URL}/aparatur/${id}`, axiosConfig)
      fetchAparatur()
    } catch (error) {
      console.error("Error deleting data:", error)

      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data?.message || "Gagal menghapus data"}`)
      } else {
        alert("Gagal menghapus data: " + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Cancel handler
  const handleCancel = () => {
    setForm(initialForm)
    setIsEditing(false)
    setShowForm(false)
  }

  // Handler untuk tombol tambah
  const handleAddNew = () => {
    setForm(initialForm)
    setIsEditing(false)
    setShowForm(true)
  }

  // Filter list
  const filteredAparat = aparatList.filter(
    (a) =>
      a.nama.toLowerCase().includes(search.toLowerCase()) || a.jabatan.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaUserPlus className="text-blue-500 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Aparat Desa</h1>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Form Tambah/Edit */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isEditing ? `Edit Aparat - ${form.nama}` : "Tambah Aparat Baru"}
              </h2>
              <div className="text-xs text-gray-500">
                Mode: {isEditing ? "EDIT" : "CREATE"} | ID: {form.id || "NULL"}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleInput}
                    required
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-100"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jabatan"
                    value={form.jabatan}
                    onChange={handleInput}
                    required
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-100"
                    placeholder="Contoh: Kepala Desa, Sekretaris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIP/NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nip"
                    value={form.nip}
                    onChange={handleInput}
                    required
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-100"
                    placeholder="Masukkan NIP atau NIK"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nohp"
                    value={form.nohp}
                    onChange={handleInput}
                    required
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-100"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    name="aktif"
                    checked={form.aktif}
                    onChange={handleInput}
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                  />
                  <label className="block text-sm text-gray-700">Status Aktif</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto{" "}
                    {isEditing && <span className="text-xs text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>}
                  </label>
                  <input
                    type="file"
                    name="foto"
                    accept="image/*"
                    onChange={handleInput}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />

                  {/* Preview foto - tampilkan foto existing atau foto baru */}
                  {(form.foto || form.existingFoto) && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">
                        {form.fotoFile ? "Preview foto baru:" : "Foto saat ini:"}
                      </div>
                      <img
                        src={form.foto || form.existingFoto || "/placeholder.svg"}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                        onError={(e) => {
                          e.target.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Loading..." : isEditing ? "Update Data" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tombol Tambah & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <FaUserPlus /> <span>Tambah Aparat</span>
          </button>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari nama/jabatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
          </div>
        </div>

        {/* List Aparat */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Foto</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Nama</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Jabatan</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">NIP/NIK</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">No. HP</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAparat.length > 0 ? (
                  filteredAparat.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        {a.foto ? (
                          <img
                            src={a.foto || "/placeholder.svg"}
                            alt={a.nama}
                            className="w-12 h-12 object-cover rounded-full border-2 border-gray-200"
                            onError={(e) => {
                              e.target.style.display = "none"
                              e.target.nextSibling.style.display = "flex"
                            }}
                          />
                        ) : null}
                        <div
                          className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-blue-200"
                          style={{ display: a.foto ? "none" : "flex" }}
                        >
                          {a.nama.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{a.nama}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{a.jabatan}</td>
                      <td className="px-6 py-4 text-gray-700 font-mono">{a.nip}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {a.nohp || <span className="text-gray-400 italic">-</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {a.aktif ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <FaCheckCircle className="text-green-600" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            <FaTimesCircle className="text-red-600" /> Tidak Aktif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(a)}
                            disabled={loading}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded disabled:opacity-50"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            disabled={loading}
                            className="text-red-500 hover:text-red-700 p-1 rounded disabled:opacity-50"
                            title="Hapus"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                          Memuat data...
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-400 mb-2">📋</div>
                          Belum ada data aparat desa
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
