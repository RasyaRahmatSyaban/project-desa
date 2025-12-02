import db from "../config/database.js";

const addSuratMasuk = async (nomorSurat, pengirim, perihal, tanggalTerima, file) => {
    try {
        const [result] = await db.query(
            "INSERT INTO suratmasuk (nomorSurat, pengirim, perihal, tanggalTerima, file) VALUES (?, ?, ?, ?, ?)",
            [nomorSurat, pengirim, perihal, tanggalTerima, file]
        );
        return {id: result.insertId, nomorSurat, pengirim, perihal, tanggalTerima, file};
    } catch (error) {
        throw error;
    }
};

const addSuratKeluar = async (nomorSurat, penerima, perihal, tanggalKirim, file) => {
    try {
        const [result] = await db.query(
            "INSERT INTO suratkeluar (nomorSurat, penerima, perihal, tanggalKirim, file) VALUES (?, ?, ?, ?, ?)",
            [nomorSurat, penerima, perihal, tanggalKirim, file]
        );
        return {id: result.insertId, nomorSurat, penerima, perihal, tanggalKirim, file};
    } catch (error) {
        throw error;
    }
};

const getAllSuratMasuk = async () => {
    try {
        const [results] = await db.query("SELECT * FROM suratmasuk ORDER BY tanggalTerima DESC");
        return results;
    } catch (error) {
        throw error;
    }
};

const getAllSuratKeluar = async () => {
    try {
        const [results] = await db.query("SELECT * FROM suratkeluar ORDER BY tanggalKirim DESC");
        return results;
    } catch (error) {
        throw error;
    }
};

const getSuratMasukById = async (id) => {
    const [result] = await db.query("SELECT * FROM suratmasuk WHERE id = ?", [id]);
    return result.length > 0 ? result[0] : null;
};

const getSuratKeluarById = async (id) => {
    const [result] = await db.query("SELECT * FROM suratkeluar WHERE id = ?", [id]);
    return result.length > 0 ? result[0] : null;
};

const updateSuratMasuk = async (id, nomorSurat, pengirim, perihal, tanggalTerima, file) => {
    try {
        const [result] = await db.query(
            "UPDATE suratmasuk SET nomorSurat = ?, pengirim = ?, perihal = ?, tanggalTerima = ?, file = ? WHERE id = ?",
            [nomorSurat, pengirim, perihal, tanggalTerima, file, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

const updateSuratKeluar = async (id, nomorSurat, penerima, perihal, tanggalKirim, file) => {
    try {
        const [result] = await db.query(
            "UPDATE suratkeluar SET nomorSurat = ?, penerima = ?, perihal = ?, tanggalKirim = ?, file = ? WHERE id = ?",
            [nomorSurat, penerima, perihal, tanggalKirim, file, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

const deleteSuratMasuk = async (id) => {
    try {
        const [result] = await db.query("DELETE FROM suratmasuk WHERE id = ?", [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

const deleteSuratKeluar = async (id) => {
    try {
        const [result] = await db.query("DELETE FROM suratkeluar WHERE id = ?", [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

export default { 
    addSuratMasuk, getAllSuratMasuk, updateSuratMasuk, deleteSuratMasuk, getSuratMasukById,
    addSuratKeluar, getAllSuratKeluar, updateSuratKeluar, deleteSuratKeluar, getSuratKeluarById
};
