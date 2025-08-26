import danaRepo from "../repositories/danaRepo.js";
import { DanaMasukDTO, DanaKeluarDTO } from "../dto/dto.js";

const addDanaMasuk = async (tahun, bulan, jumlah, sumber, keterangan) => {
  if (!tahun || !bulan || !jumlah || !sumber || !keterangan) {
    throw new Error("Semua field wajib diisi!");
  }

  try {
    const result = await danaRepo.addDanaMasuk(
      tahun,
      bulan,
      jumlah,
      sumber,
      keterangan
    );
    return new DanaMasukDTO(
      result.id,
      result.tahun,
      result.bulan,
      result.jumlah,
      result.sumber,
      result.keterangan
    );
  } catch (error) {
    throw new Error("Gagal menambahkan data pemasukan: " + error.message);
  }
};

const addDanaKeluar = async (tahun, bulan, jumlah, kategori, keterangan) => {
  if (!tahun || !bulan || !jumlah || !kategori || !keterangan) {
    throw new Error("Semua field harus diisi");
  }

  try {
    const result = await danaRepo.addDanaKeluar(
      tahun,
      bulan,
      jumlah,
      kategori,
      keterangan
    );
    return new DanaKeluarDTO(
      result.id,
      tahun,
      bulan,
      jumlah,
      kategori,
      keterangan
    );
  } catch (error) {
    throw new Error("Gagal menambahkan data pengeluaran: " + error.message);
  }
};

const getAllDanaMasuk = async () => {
  const result = await danaRepo.getAllDanaMasuk();
  return result.map(
    (b) =>
      new DanaMasukDTO(b.id, b.tahun, b.bulan, b.jumlah, b.sumber, b.keterangan)
  );
};

const getAllDanaKeluar = async () => {
  const result = await danaRepo.getAllDanaKeluar();
  return result.map(
    (b) =>
      new DanaKeluarDTO(
        b.id,
        b.tahun,
        b.bulan,
        b.jumlah,
        b.kategori,
        b.keterangan
      )
  );
};

const getDanaMasukById = async (id) => {
  const result = await danaRepo.getDanaMasukById(id);
  if (!result) {
    throw new Error("Dana tidak ditemukan");
  }
  return new DanaMasukDTO(
    result.id,
    result.tahun,
    result.bulan,
    result.jumlah,
    result.sumber,
    result.keterangan
  );
};

const getDanaKeluarById = async (id) => {
  const result = await danaRepo.getDanaKeluarById(id);
  if (!result) {
    throw new Error("Dana tidak ditemukan");
  }
  return new DanaKeluarDTO(
    result.id,
    result.tahun,
    result.bulan,
    result.jumlah,
    result.kategori,
    result.keterangan
  );
};

const getSummaryByYear = async (tahun) => {
  try {
    return await danaRepo.getSummaryByYear(tahun);
  } catch (error) {
    throw new Error("Gagal mengambil ringkasan APBDes: " + error.message);
  }
};

const getDetailByYear = async (tahun) => {
  try {
    return await danaRepo.getDetailByYear(tahun);
  } catch (error) {
    throw new Error("Gagal mengambil detail APBDes: " + error.message);
  }
};

const updateDanaMasuk = async (
  id,
  tahun,
  bulan,
  jumlah,
  sumber,
  keterangan
) => {
  try {
    const existing = getDanaMasukById(id);
    if (!existing) {
      return new Error("Dana Masuk tidak ditemukan");
    }
    await danaRepo.updateDanaMasuk(
      id,
      tahun,
      bulan,
      jumlah,
      sumber,
      keterangan
    );
    return {
      success: true,
      message: "dana berhasil diperbarui",
      id,
      tahun,
      bulan,
      jumlah,
      sumber,
      keterangan,
    };
  } catch (error) {
    throw error;
  }
};

const updateDanaKeluar = async (
  id,
  tahun,
  bulan,
  jumlah,
  kategori,
  keterangan
) => {
  try {
    const existing = getDanaKeluarById(id);
    if (!existing) {
      return new Error("Dana Keluar tidak ditemukan");
    }
    await danaRepo.updateDanaKeluar(
      id,
      tahun,
      bulan,
      jumlah,
      kategori,
      keterangan
    );
    return {
      success: true,
      message: "dana berhasil diperbarui",
      id,
      tahun,
      bulan,
      jumlah,
      kategori,
      keterangan,
    };
  } catch (error) {
    throw error;
  }
};

const deleteDanaMasuk = async (id) => {
  const existing = await danaRepo.getDanaMasukById(id);
  if (!existing) {
    return false;
  }
  return await danaRepo.deleteDanaMasuk(id);
};

const deleteDanaKeluar = async (id) => {
  const existing = await danaRepo.getDanaKeluarById(id);
  if (!existing) {
    return false;
  }
  return await danaRepo.deleteDanaKeluar(id);
};

export default {
  addDanaMasuk,
  addDanaKeluar,
  getSummaryByYear,
  getDetailByYear,
  getAllDanaKeluar,
  getAllDanaMasuk,
  getDanaKeluarById,
  getDanaMasukById,
  updateDanaKeluar,
  updateDanaMasuk,
  deleteDanaKeluar,
  deleteDanaMasuk,
};
