import db from "../config/database.js";

const addMedia = async (nama, tipe, file, deskripsi, thumbnail) => {
  try {
    const [result] = await db.query(
      "INSERT INTO media (nama, tipe, file, deskripsi, thumbnail) VALUES (?, ?, ?, ?, ?)",
      [nama, tipe, file, deskripsi, thumbnail]
    );
    return { id: result.insertId, nama, tipe, file, deskripsi, thumbnail };
  } catch (error) {
    "repo", error;
  }
};

const getAllMedia = async () => {
  const [results] = await db.query("SELECT * FROM media ORDER BY id DESC");
  return results;
};

const getMediaById = async (id) => {
  const [result] = await db.query("SELECT * FROM media WHERE id = ?", [id]);
  return result.length > 0 ? result[0] : null;
};

const updateMedia = async (id, nama, tipe, file, deskripsi, thumbnail) => {
  const [result] = await db.query(
    "UPDATE media SET nama = ?, tipe = ?, file = ?, deskripsi = ?, thumbnail = ? WHERE id = ?",
    [nama, tipe, file, deskripsi, thumbnail, id]
  );
  return result.affectedRows > 0;
};

const deleteMedia = async (id) => {
  const [result] = await db.query("DELETE FROM media WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export default {
  addMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
};
