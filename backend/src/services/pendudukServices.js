import pendudukRepo from "../repositories/pendudukRepo.js"
import { PendudukDTO } from "../dto/dto.js"
import kepalaKeluargaRepo from "../repositories/kepalaKeluargaRepo.js"
import kepalaKeluargaService from "./kepalaKeluargaServices.js"

const getAllPenduduk = async () => {
  try {
    const results = await pendudukRepo.getAllPenduduk()
    return results.map(
      (p) =>
        new PendudukDTO(
          p.id,
          p.nama,
          p.nik,
          p.alamat,
          p.tanggalLahir,
          p.jenisKelamin,
          p.agama,
          p.id_kepalakeluarga,
          p.namaKepalaKeluarga,
        ),
    )
  } catch (error) {
    throw new Error("Gagal mengambil data semua penduduk")
  }
}

const getPendudukByNik = async (nik) => {
  try {
    const result = await pendudukRepo.getPendudukByNik(nik)
    if (!result) {
      return null
    }
    return new PendudukDTO(
      result.id,
      result.nama,
      result.nik,
      result.alamat,
      result.tanggalLahir,
      result.jenisKelamin,
      result.agama,
      result.id_kepalakeluarga,
      result.namaKepalaKeluarga,
    )
  } catch (error) {
    throw new Error("Gagal mengambil data penduduk berdasarkan NIK")
  }
}

const addPenduduk = async (
  nama,
  nik,
  alamat,
  tanggalLahir,
  jenisKelamin,
  agama,
  id_kepalakeluarga,
  isKepalaKeluarga = false,
) => {
  if (!nama || !nik || !alamat || !tanggalLahir || !jenisKelamin || !agama) {
    throw new Error("Semua data wajib diisi!")
  }

  const existingPenduduk = await pendudukRepo.getPendudukByNik(nik)
  if (existingPenduduk) {
    throw new Error("NIK sudah terdaftar!")
  }

  try {
    let kepalaKeluargaId = id_kepalakeluarga

    if (isKepalaKeluarga) {
      const existingKK = await kepalaKeluargaRepo.getKepalaKeluargaByNik(nik)
      if (existingKK) {
        throw new Error("NIK sudah terdaftar sebagai kepala keluarga!")
      }

      const kepalaKeluargaData = await kepalaKeluargaService.addKepalaKeluarga(nama, nik)
      kepalaKeluargaId = kepalaKeluargaData.id
    } else if (id_kepalakeluarga) {
      const existingKK = await kepalaKeluargaRepo.getKepalaKeluargaById(id_kepalakeluarga)
      if (!existingKK) {
        throw new Error(`Kepala keluarga dengan ID ${id_kepalakeluarga} tidak ditemukan!`)
      }
    }

    const result = await pendudukRepo.addPenduduk(
      nama,
      nik,
      alamat,
      tanggalLahir,
      jenisKelamin,
      agama,
      kepalaKeluargaId,
    )

    return new PendudukDTO(
      result.id,
      result.nama,
      result.nik,
      result.alamat,
      result.tanggalLahir,
      result.jenisKelamin,
      result.agama,
      result.id_kepalakeluarga,
      result.namaKepalaKeluarga,
    )
  } catch (error) {
    throw new Error("Gagal menambahkan data penduduk: " + error.message)
  }
}

const updateDataPenduduk = async (
  oldNik,
  nama,
  newNik,
  alamat,
  tanggalLahir,
  jenisKelamin,
  agama,
  id_kepalakeluarga,
) => {
  const existingPenduduk = await pendudukRepo.getPendudukByNik(oldNik)
  if (!existingPenduduk) {
    throw new Error("Data dengan NIK tersebut tidak ditemukan")
  }

  if (newNik !== oldNik) {
    const nikExists = await pendudukRepo.getPendudukByNik(newNik)
    if (nikExists) {
      throw new Error("NIK baru sudah digunakan oleh penduduk lain")
    }
  }

  if (id_kepalakeluarga) {
    const existingKK = await kepalaKeluargaRepo.getKepalaKeluargaById(id_kepalakeluarga)
    if (!existingKK) {
      throw new Error(`Kepala keluarga dengan ID ${id_kepalakeluarga} tidak ditemukan!`)
    }
  }

  try {
    const isKepalaKeluarga = await kepalaKeluargaRepo.getKepalaKeluargaByNik(oldNik)

    await pendudukRepo.updateDataPenduduk(
      oldNik,
      nama,
      newNik,
      alamat,
      tanggalLahir,
      jenisKelamin,
      agama,
      id_kepalakeluarga,
    )

    if (isKepalaKeluarga) {
      await kepalaKeluargaService.updateKepalaKeluargaByNik(oldNik, nama, newNik)
    }

    return {
      success: true,
      message: "Data berhasil diperbarui",
      nama,
      newNik,
      alamat,
      tanggalLahir,
      jenisKelamin,
      agama,
      id_kepalakeluarga,
    }
  } catch (error) {
    throw new Error("Gagal memperbarui data: " + error.message)
  }
}

const deleteDataPenduduk = async (nik) => {
  try {
    const existingPenduduk = await pendudukRepo.getPendudukByNik(nik)
    if (!existingPenduduk) {
      return {
        success: false,
        message: "Data dengan NIK tersebut tidak ditemukan",
      }
    }

    const isKepalaKeluarga = await kepalaKeluargaRepo.getKepalaKeluargaByNik(nik)

    if (isKepalaKeluarga) {
      const anggotaKeluarga = await pendudukRepo.getPendudukByKepalaKeluarga(isKepalaKeluarga.id)
      const anggotaLain = anggotaKeluarga.filter((anggota) => anggota.nik !== nik)

      if (anggotaLain.length > 0) {
        return {
          success: false,
          message: `Tidak dapat menghapus kepala keluarga karena masih ada ${anggotaLain.length} anggota keluarga lain. Hapus atau pindahkan anggota keluarga terlebih dahulu, atau gunakan opsi "Hapus Semua Data Keluarga".`,
          isKepalaKeluarga: true,
          jumlahAnggota: anggotaLain.length,
          namaKepalaKeluarga: existingPenduduk.nama,
        }
      } else {
        await pendudukRepo.deleteDataPenduduk(nik)
        await kepalaKeluargaService.deleteKepalaKeluarga(isKepalaKeluarga.id)

        return {
          success: true,
          message: "Data kepala keluarga berhasil dihapus",
        }
      }
    } else {
      const isDeleted = await pendudukRepo.deleteDataPenduduk(nik)
      if (!isDeleted) {
        return { success: false, message: "Gagal menghapus data" }
      }
      return { success: true, message: "Data berhasil dihapus" }
    }
  } catch (error) {
    throw new Error("Gagal menghapus data: " + error.message)
  }
}

const deleteSemuaKeluarga = async (nik) => {
  try {
    const existingPenduduk = await pendudukRepo.getPendudukByNik(nik)
    if (!existingPenduduk) {
      return {
        success: false,
        message: "Data dengan NIK tersebut tidak ditemukan",
      }
    }

    const isKepalaKeluarga = await kepalaKeluargaRepo.getKepalaKeluargaByNik(nik)

    if (!isKepalaKeluarga) {
      return {
        success: false,
        message: "Data ini bukan kepala keluarga, gunakan delete biasa",
      }
    }

    const anggotaKeluarga = await pendudukRepo.getPendudukByKepalaKeluarga(isKepalaKeluarga.id)

    for (const anggota of anggotaKeluarga) {
      await pendudukRepo.deleteDataPenduduk(anggota.nik)
    }

    await kepalaKeluargaService.deleteKepalaKeluarga(isKepalaKeluarga.id)

    return {
      success: true,
      message: `Data kepala keluarga "${existingPenduduk.nama}" dan ${anggotaKeluarga.length - 1} anggota keluarga berhasil dihapus`,
      totalDeleted: anggotaKeluarga.length,
    }
  } catch (error) {
    throw new Error("Gagal menghapus semua data keluarga: " + error.message)
  }
}

const getTotalPenduduk = async () => {
  try {
    return await pendudukRepo.getTotalPenduduk()
  } catch (error) {
    throw new Error("Gagal mengambil total penduduk")
  }
}

const getTotalKepalaKeluarga = async () => {
  try {
    return await pendudukRepo.getTotalKepalaKeluarga()
  } catch (error) {
    throw new Error("Gagal mengambil total kepala keluarga")
  }
}

const getTotalLakiLaki = async () => {
  try {
    return await pendudukRepo.getTotalLakiLaki()
  } catch (error) {
    throw new Error("Gagal mengambil total laki-laki")
  }
}

const getTotalPerempuan = async () => {
  try {
    return await pendudukRepo.getTotalPerempuan()
  } catch (error) {
    throw new Error("Gagal mengambil total perempuan")
  }
}

const getPendudukByAgama = async () => {
  try {
    return await pendudukRepo.getPendudukByAgama()
  } catch (error) {
    throw new Error("Gagal mengambil data berdasarkan agama")
  }
}

const getPendudukByUmur = async () => {
  try {
    return await pendudukRepo.getPendudukByUmur()
  } catch (error) {
    throw new Error("Gagal mengambil data berdasarkan umur")
  }
}

const getPendudukByKepalaKeluarga = async (id_kepalakeluarga) => {
  try {
    const results = await pendudukRepo.getPendudukByKepalaKeluarga(id_kepalakeluarga)
    return results.map(
      (p) =>
        new PendudukDTO(
          p.id,
          p.nama,
          p.nik,
          p.alamat,
          p.tanggalLahir,
          p.jenisKelamin,
          p.agama,
          p.id_kepalakeluarga,
          p.namaKepalaKeluarga,
        ),
    )
  } catch (error) {
    throw new Error("Gagal mengambil data penduduk berdasarkan kepala keluarga")
  }
}

const searchPendudukByKepalaKeluarga = async (searchTerm) => {
  try {
    const results = await pendudukRepo.searchPendudukByKepalaKeluarga(searchTerm)
    return results.map(
      (p) =>
        new PendudukDTO(
          p.id,
          p.nama,
          p.nik,
          p.alamat,
          p.tanggalLahir,
          p.jenisKelamin,
          p.agama,
          p.id_kepalakeluarga,
          p.namaKepalaKeluarga,
        ),
    )
  } catch (error) {
    throw new Error("Gagal mencari data penduduk berdasarkan kepala keluarga")
  }
}

export default {
  getAllPenduduk,
  getPendudukByNik,
  addPenduduk,
  updateDataPenduduk,
  deleteDataPenduduk,
  deleteSemuaKeluarga,
  getPendudukByUmur,
  getTotalKepalaKeluarga,
  getTotalLakiLaki,
  getTotalPerempuan,
  getTotalPenduduk,
  getPendudukByAgama,
  getPendudukByKepalaKeluarga,
  searchPendudukByKepalaKeluarga,
}
