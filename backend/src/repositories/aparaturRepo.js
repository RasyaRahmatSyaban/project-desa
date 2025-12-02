import db from "../config/database.js";

const getAllAparatur = async () => {
  try {
    const [results] = await db.query(`
      SELECT * FROM aparatur
      ORDER BY
        CASE
          WHEN JABATAN LIKE 'Kepala Desa' THEN 1
          WHEN jabatan LIKE '%Sekretaris%' THEN 2
          WHEN jabatan LIKE '%Kepala%' THEN 3
          WHEN jabatan LIKE '%Bendahara%' THEN 4
          ELSE 99
        END,
        nama ASC
    `);
    return results;
  } catch (error) {
    throw error;
  }
};

const getAparaturById = async (id) => {
  try {
    const [results] = await db
      .query("SELECT * FROM aparatur WHERE id = ?", [id]);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    throw error;
  }
};

const getAparaturByNip = async (nip) => {
  try {
    const [results] = await db
      .query("SELECT * FROM aparatur WHERE nip = ?", [nip]);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    throw error;
  }
};

const addAparatur = async (nama, nip, jabatan, foto) => {
  try {
    const [result] = await db
      .query(
        "INSERT INTO aparatur (nama, nip, jabatan, foto) VALUES (?, ?, ?, ?)",
        [nama, nip, jabatan, foto]
      );

    // Return data yang baru diinsert
    const newData = await getAparaturById(result.insertId);
    return newData;
  } catch (error) {
    throw error;
  }
};

const updateAparatur = async (id, nama, nip, jabatan, foto) => {
  try {
    // Ambil data existing untuk mendapatkan foto lama
    const existingData = await getAparaturById(id);
    if (!existingData) {
      throw new Error("Data tidak ditemukan");
    }

    // Jika foto null (tidak ada file baru), gunakan foto lama
    const finalFoto = foto !== null ? foto : existingData.foto;

    // Update dengan foto yang sudah ditentukan
    await db
      .query(
        "UPDATE aparatur SET nama = ?, nip = ?, jabatan = ?, foto = ? WHERE id = ?",
        [nama, nip, jabatan, finalFoto, id]
      );

    // Return data yang sudah diupdate
    return await getAparaturById(id);
  } catch (error) {
    throw error;
  }
};

const deleteAparatur = async (id) => {
  try {
    const [result] = await db
      .query("DELETE FROM aparatur WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllAparatur,
  getAparaturById,
  getAparaturByNip,
  addAparatur,
  updateAparatur,
  deleteAparatur,
};
