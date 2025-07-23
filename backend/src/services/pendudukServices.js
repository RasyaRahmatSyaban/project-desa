import pendudukRepo from "../repositories/pendudukRepo.js";
import { PendudukDTO } from "../dto/dto.js";

const getAllPenduduk = async () => {
  try {
    const results = await pendudukRepo.getAllPenduduk();
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
          p.kepalaKeluarga
        )
    );
  } catch (error) {
    throw new Error("Gagal mengambil data semua penduduk");
  }
};

const getPendudukByNik = async (nik) => {
  try {
    const result = await pendudukRepo.getPendudukByNik(nik);
    if (!result) {
      return { success: false, message: "Data tidak ditemukan" };
    }
    return new PendudukDTO(
      result.id,
      result.nama,
      result.nik,
      result.alamat,
      result.tanggalLahir,
      result.jenisKelamin,
      result.agama,
      result.kepalaKeluarga
    );
  } catch (error) {
    error;
    throw new Error("Gagal mengambil data penduduk berdasarkan NIK");
  }
};

const addPenduduk = async (
  nama,
  nik,
  alamat,
  tanggalLahir,
  jenisKelamin,
  agama,
  kepalaKeluarga
) => {
  kepalaKeluarga = kepalaKeluarga ? 1 : 0;
  if (
    !nama ||
    !nik ||
    !alamat ||
    !tanggalLahir ||
    !jenisKelamin ||
    !agama 
  ) {
    throw new Error("Semua data wajib diisi!");
  }
  try {
    const result = await pendudukRepo.addPenduduk(
      nama,
      nik,
      alamat,
      tanggalLahir,
      jenisKelamin,
      agama,
      kepalaKeluarga
    );
    return new PendudukDTO(
      result.id,
      result.nama,
      result.nik,
      result.alamat,
      result.tanggalLahir,
      result.jenisKelamin,
      result.agama,
      result.kepalaKeluarga
    );
  } catch (error) {
    throw new Error("Gagal menambahkan data penduduk");
  }
};

const updateDataPenduduk = async (
  oldNik,
  nama,
  newNik,
  alamat,
  tanggalLahir,
  jenisKelamin,
  agama,
  kepalaKeluarga
) => {
  kepalaKeluarga = kepalaKeluarga ? 1 : 0;
  const existingPenduduk = await pendudukRepo.getPendudukByNik(oldNik);
  if (!existingPenduduk) {
    throw new Error("Data dengan NIK tersebut tidak ditemukan");
  }

  if (newNik !== oldNik) {
    const nikExists = await pendudukRepo.getPendudukByNik(newNik);
    if (nikExists) {
      throw new Error("NIK baru sudah digunakan oleh penduduk lain");
    }
  }

  await pendudukRepo.updateDataPenduduk(
    oldNik,
    nama,
    newNik,
    alamat,
    tanggalLahir,
    jenisKelamin,
    agama,
    kepalaKeluarga
  );
  return {
    success: true,
    message: "Data berhasil diperbarui",
    nama,
    newNik,
    alamat,
    tanggalLahir,
    jenisKelamin,
    agama,
    kepalaKeluarga,
  };
};

const deleteDataPenduduk = async (nik) => {
  try {
    const existingPenduduk = await pendudukRepo.getPendudukByNik(nik);
    if (!existingPenduduk) {
      return {
        success: false,
        message: "Data dengan NIK tersebut tidak ditemukan",
      };
    }
    const isDeleted = await pendudukRepo.deleteDataPenduduk(nik);
    if (!isDeleted) {
      return { success: false, message: "Gagal menghapus data" };
    }
    return { success: true, message: "Data berhasil dihapus" };
  } catch (error) {
    throw error;
  }
};

const getTotalPenduduk = async () => {
  try {
    return await pendudukRepo.getTotalPenduduk();
  } catch (error) {
    throw new Error("Gagal mengambil total penduduk");
  }
};

const getTotalKepalaKeluarga = async () => {
  try {
    return await pendudukRepo.getTotalKepalaKeluarga();
  } catch (error) {
    throw new Error("Gagal mengambil total kepala keluarga");
  }
};

const getTotalLakiLaki = async () => {
  try {
    return await pendudukRepo.getTotalLakiLaki();
  } catch (error) {
    throw new Error("Gagal mengambil total laki-laki");
  }
};

const getTotalPerempuan = async () => {
  try {
    return await pendudukRepo.getTotalPerempuan();
  } catch (error) {
    throw new Error("Gagal mengambil total perempuan");
  }
};

const getPendudukByAgama = async () => {
  try {
    return await pendudukRepo.getPendudukByAgama();
  } catch (error) {
    throw new Error("Gagal mengambil data berdasarkan agama");
  }
};

const getPendudukByUmur = async () => {
  try {
    return await pendudukRepo.getPendudukByUmur();
  } catch (error) {
    throw new Error("Gagal mengambil data berdasarkan umur");
  }
};

export default {
  getAllPenduduk,
  getPendudukByNik,
  addPenduduk,
  updateDataPenduduk,
  deleteDataPenduduk,
  getPendudukByUmur,
  getTotalKepalaKeluarga,
  getTotalLakiLaki,
  getTotalPerempuan,
  getTotalPenduduk,
  getPendudukByAgama,
};
