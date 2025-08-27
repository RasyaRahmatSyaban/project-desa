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
          p.id_kepalakeluarga,
          p.status
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
      return null;
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
      result.status
    );
  } catch (error) {
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
  id_kepalakeluarga,
  status
) => {
  if (
    !nama ||
    !nik ||
    !alamat ||
    !tanggalLahir ||
    !jenisKelamin ||
    !agama ||
    !status
  ) {
    throw new Error("Semua data wajib diisi!");
  }

  const existingPenduduk = await pendudukRepo.getPendudukByNik(nik);
  if (existingPenduduk) {
    throw new Error("NIK sudah terdaftar!");
  }

  if (status === "Kepala Keluarga") {
    id_kepalakeluarga = null;
  } else {
    if (!id_kepalakeluarga) {
      throw new Error("Anggota keluarga harus memiliki kepala keluarga.");
    }
    const existingKK = await pendudukRepo.getPendudukById(id_kepalakeluarga);
    if (!existingKK || existingKK.status !== "Kepala Keluarga") {
      throw new Error(
        `Kepala keluarga dengan ID ${id_kepalakeluarga} tidak ditemukan atau bukan kepala keluarga.`
      );
    }
  }

  try {
    const result = await pendudukRepo.addPenduduk(
      nama,
      nik,
      alamat,
      tanggalLahir,
      jenisKelamin,
      agama,
      id_kepalakeluarga,
      status
    );
    return new PendudukDTO(
      result.id,
      result.nama,
      result.nik,
      result.alamat,
      result.tanggalLahir,
      result.jenisKelamin,
      result.agama,
      result.id_kepalakeluarga,
      result.status
    );
  } catch (error) {
    throw new Error("Gagal menambahkan data penduduk: " + error.message);
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
  id_kepalakeluarga,
  status
) => {
  const existingPenduduk = await pendudukRepo.getPendudukByNik(oldNik);
  if (!existingPenduduk) {
    throw new Error("Data dengan NIK tersebut tidak ditemukan");
  }

  // Validasi: tidak boleh memilih diri sendiri sebagai kepala keluarga
  if (id_kepalakeluarga && existingPenduduk.id === id_kepalakeluarga) {
    throw new Error(
      "Tidak boleh memilih diri sendiri sebagai kepala keluarga!"
    );
  }

  let finalIdKepalaKeluarga = id_kepalakeluarga;
  if (status === "Kepala Keluarga") {
    finalIdKepalaKeluarga = null;
  } else {
    if (!finalIdKepalaKeluarga) {
      throw new Error("Anggota keluarga harus memiliki kepala keluarga.");
    }
    const existingKK = await pendudukRepo.getPendudukById(
      finalIdKepalaKeluarga
    );
    if (!existingKK || existingKK.status !== "Kepala Keluarga") {
      throw new Error("ID yang dipilih bukan kepala keluarga.");
    }
  }

  try {
    await pendudukRepo.updateDataPenduduk(
      oldNik,
      nama,
      newNik,
      alamat,
      tanggalLahir,
      jenisKelamin,
      agama,
      finalIdKepalaKeluarga,
      status
    );
    return { success: true, message: "Data penduduk berhasil diperbarui." };
  } catch (error) {
    throw new Error("Gagal memperbarui data penduduk: " + error.message);
  }
};

const deleteDataPenduduk = async (nik) => {
  try {
    const existingPenduduk = await pendudukRepo.getPendudukByNik(nik);
    if (!existingPenduduk) {
      return { success: false, message: "Data penduduk tidak ditemukan." };
    }

    if (existingPenduduk.status === "Kepala Keluarga") {
      const dependents = await pendudukRepo.getAnggotaKeluargaByKepalaKeluarga(
        existingPenduduk.id
      );
      if (dependents.length > 0) {
        throw new Error(
          "Tidak dapat menghapus kepala keluarga yang masih memiliki anggota keluarga."
        );
      }
    }

    const isDeleted = await pendudukRepo.deleteDataPenduduk(nik);
    if (!isDeleted) {
      throw new Error("Gagal menghapus data penduduk");
    }
    return { success: true, message: "Data berhasil dihapus" };
  } catch (error) {
    throw error;
  }
};

// Fungsi statistik
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

const getAllKepalaKeluarga = async () => {
  try {
    const results = await pendudukRepo.getAllKepalaKeluarga();
    return results.map((p) => new PendudukDTO(p.id, p.nama, p.nik));
  } catch (error) {
    throw new Error("Gagal mengambil daftar kepala keluarga.");
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
  getAllKepalaKeluarga,
};
