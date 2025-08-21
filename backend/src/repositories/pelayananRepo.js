import db from "../config/database.js";

const addPelayanan = async (nama_layanan, kategori, deskripsi, link_google_form) => {
    const [result] = await db.promise().query(
        "INSERT INTO pelayanan (nama_layanan, kategori, deskripsi, link_google_form) VALUES (?, ?, ?, ?)",
        [nama_layanan, kategori, deskripsi, link_google_form]
    );
    return { id: result.insertId, nama_layanan, kategori, deskripsi, link_google_form };
};

const getAllPelayanan = async () => {
    const [results] = await db.promise().query("SELECT * FROM pelayanan ORDER BY id DESC");
    return results;
};

const getPelayananById = async (id) => {
    const [result] = await db.promise().query("SELECT * FROM pelayanan WHERE id = ?", [id]);
    return result.length > 0 ? result[0] : null;
};

const updatePelayanan = async (id, nama_layanan, kategori, deskripsi, link_google_form) => {
    const [result] = await db.promise().query(
        "UPDATE pelayanan SET nama_layanan = ?, kategori = ?, deskripsi = ?, link_google_form = ? WHERE id = ?",
        [nama_layanan, kategori, deskripsi, link_google_form, id]
    );
    return result.affectedRows > 0;
};

const deletePelayanan = async (id) => {
    const [result] = await db.promise().query("DELETE FROM pelayanan WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

export default { addPelayanan, getAllPelayanan, getPelayananById, updatePelayanan, deletePelayanan };
