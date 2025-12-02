import db from "../config/database.js";

const getAllBerita = async () => {
  try {
    const [results] = await db
      .query("SELECT * FROM berita ORDER BY tanggalTerbit DESC");
    return results;
  } catch (error) {
    throw error;
  }
};

// Tambahkan fungsi untuk mendapatkan berita berdasarkan status
const getBeritaByStatus = async (status) => {
  try {
    const [results] = await db
      .query(
        "SELECT * FROM berita WHERE status = ? ORDER BY tanggalTerbit DESC",
        [status]
      );
    return results;
  } catch (error) {
    throw error;
  }
};

const getBeritaById = async (id) => {
  try {
    const [result] = await db
      .query("SELECT * FROM berita WHERE id = ?", [id]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw error;
  }
};

const addBerita = async (judul, foto, isi, tanggalTerbit, penulis, status) => {
  try {
    // Perbaikan: Tambahkan status dan sesuaikan jumlah placeholder
    const [result] = await db
      .query(
        "INSERT INTO berita (judul, foto, isi, tanggalTerbit, penulis, status) VALUES (?, ?, ?, ?, ?, ?)",
        [judul, foto, isi, tanggalTerbit, penulis, status]
      );

    // Ambil ID yang baru dibuat
    const id = result.insertId;

    // Ambil data berita yang baru dibuat
    const [newBerita] = await db
      .query("SELECT * FROM berita WHERE id = ?", [id]);
    return newBerita[0];
  } catch (error) {
    throw error;
  }
};

const updateBerita = async (
  id,
  judul,
  foto,
  isi,
  tanggalTerbit,
  penulis,
  status
) => {
  try {
    // Cek apakah foto diupdate
    if (foto) {
      // Jika foto diupdate
      const [result] = await db
        .query(
          "UPDATE berita SET judul = ?, foto = ?, isi = ?, tanggalTerbit = ?, penulis = ?, status = ? WHERE id = ?",
          [judul, foto, isi, tanggalTerbit, penulis, status, id]
        );
      return result.affectedRows > 0;
    } else {
      // Jika foto tidak diupdate, jangan ubah nilai foto
      const [result] = await db
        .query(
          "UPDATE berita SET judul = ?, isi = ?, tanggalTerbit = ?, penulis = ?, status = ? WHERE id = ?",
          [judul, isi, tanggalTerbit, penulis, status, id]
        );
      return result.affectedRows > 0;
    }
  } catch (error) {
    throw error;
  }
};

const deleteBerita = async (id) => {
  try {
    const [result] = await db
      .query("DELETE FROM berita WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllBerita,
  getBeritaById,
  getBeritaByStatus,
  addBerita,
  updateBerita,
  deleteBerita,
};
