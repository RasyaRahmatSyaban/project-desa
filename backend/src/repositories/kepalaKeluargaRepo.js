import db from "../config/database.js";

const getAllKepalaKeluarga = async () => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM kepalakeluarga ORDER BY nama ASC");
    return results;
  } catch (error) {
    throw error;
  }
};

const getKepalaKeluargaById = async (id) => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM kepalakeluarga WHERE id = ?", [id]);
    return results.length ? results[0] : null;
  } catch (error) {
    throw error;
  }
};

const getKepalaKeluargaByNik = async (nik) => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM kepalakeluarga WHERE nik = ?", [nik]);
    return results.length ? results[0] : null;
  } catch (error) {
    throw error;
  }
};

const addKepalaKeluarga = async (nama, nik) => {
  try {
    const [results] = await db
      .promise()
      .query("INSERT INTO kepalakeluarga (nama, nik) VALUES (?, ?)", [
        nama,
        nik,
      ]);
    return { id: results.insertId, nama, nik };
  } catch (error) {
    throw error;
  }
};

const updateKepalaKeluarga = async (id, nama, nik) => {
  try {
    const [results] = await db
      .promise()
      .query("UPDATE kepalakeluarga SET nama = ?, nik = ? WHERE id = ?", [
        nama,
        nik,
        id,
      ]);
    return results.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// Update kepala keluarga berdasarkan NIK lama (untuk sinkronisasi dengan update penduduk)
const updateKepalaKeluargaByNik = async (oldNik, nama, newNik) => {
  try {
    const [results] = await db
      .promise()
      .query("UPDATE kepalakeluarga SET nama = ?, nik = ? WHERE nik = ?", [nama, newNik, oldNik])
    return results.affectedRows > 0
  } catch (error) {
    throw error
  }
}

const deleteKepalaKeluarga = async (id) => {
  try {
    const [results] = await db
      .promise()
      .query("DELETE FROM kepalakeluarga WHERE id = ?", [id]);
    return results.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllKepalaKeluarga,
  getKepalaKeluargaById,
  getKepalaKeluargaByNik,
  addKepalaKeluarga,
  updateKepalaKeluarga,
  updateKepalaKeluargaByNik,
  deleteKepalaKeluarga,
};
