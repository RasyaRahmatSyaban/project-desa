import kepalaKeluargaRepo from "../repositories/kepalaKeluargaRepo.js"
import { KepalaKeluargaDTO } from "../dto/dto.js"

const getAllKepalaKeluarga = async () => {
  try {
    const results = await kepalaKeluargaRepo.getAllKepalaKeluarga()
    return results.map((kk) => new KepalaKeluargaDTO(kk.id, kk.nama, kk.nik))
  } catch (error) {
    throw new Error("Gagal mengambil data kepala keluarga: " + error.message)
  }
}

const getKepalaKeluargaById = async (id) => {
  try {
    const result = await kepalaKeluargaRepo.getKepalaKeluargaById(id)
    if (!result) {
      return null
    }
    return new KepalaKeluargaDTO(result.id, result.nama, result.nik)
  } catch (error) {
    throw new Error("Gagal mengambil data kepala keluarga berdasarkan ID")
  }
}

const getKepalaKeluargaByNik = async (nik) => {
  try {
    const result = await kepalaKeluargaRepo.getKepalaKeluargaByNik(nik)
    if (!result) {
      return null
    }
    return new KepalaKeluargaDTO(result.id, result.nama, result.nik)
  } catch (error) {
    throw new Error("Gagal mengambil data kepala keluarga berdasarkan NIK")
  }
}

const addKepalaKeluarga = async (nama, nik) => {
  if (!nama || !nik) {
    throw new Error("Nama dan NIK kepala keluarga wajib diisi!")
  }

  const existing = await kepalaKeluargaRepo.getKepalaKeluargaByNik(nik)
  if (existing) {
    throw new Error("NIK kepala keluarga sudah terdaftar!")
  }

  try {
    const result = await kepalaKeluargaRepo.addKepalaKeluarga(nama, nik)
    return new KepalaKeluargaDTO(result.id, result.nama, result.nik)
  } catch (error) {
    throw new Error("Gagal menambahkan data kepala keluarga")
  }
}

const updateKepalaKeluarga = async (id, nama, nik) => {
  const existingById = await kepalaKeluargaRepo.getKepalaKeluargaById(id)
  if (!existingById) {
    throw new Error("Data kepala keluarga tidak ditemukan")
  }

  if (nik !== existingById.nik) {
    const existingByNik = await kepalaKeluargaRepo.getKepalaKeluargaByNik(nik)
    if (existingByNik && existingByNik.id !== Number.parseInt(id)) {
      throw new Error("NIK sudah digunakan oleh kepala keluarga lain")
    }
  }

  try {
    const updated = await kepalaKeluargaRepo.updateKepalaKeluarga(id, nama, nik)
    if (!updated) {
      return false
    }
    return new KepalaKeluargaDTO(id, nama, nik)
  } catch (error) {
    throw new Error("Gagal memperbarui data kepala keluarga")
  }
}

const updateKepalaKeluargaByNik = async (oldNik, nama, newNik) => {
  try {
    const updated = await kepalaKeluargaRepo.updateKepalaKeluargaByNik(oldNik, nama, newNik)
    return updated
  } catch (error) {
    throw new Error("Gagal memperbarui data kepala keluarga berdasarkan NIK")
  }
}

const deleteKepalaKeluarga = async (id) => {
  try {
    const existing = await kepalaKeluargaRepo.getKepalaKeluargaById(id)
    if (!existing) {
      return false
    }
    return await kepalaKeluargaRepo.deleteKepalaKeluarga(id)
  } catch (error) {
    throw new Error("Gagal menghapus data kepala keluarga")
  }
}

export default {
  getAllKepalaKeluarga,
  getKepalaKeluargaById,
  getKepalaKeluargaByNik,
  addKepalaKeluarga,
  updateKepalaKeluarga,
  updateKepalaKeluargaByNik,
  deleteKepalaKeluarga,
}
