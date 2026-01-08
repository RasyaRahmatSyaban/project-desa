import db from "../config/database.js";

const addDanaMasuk = async (tahun, bulan, jumlah, sumber, keterangan) => {
    try {
        const [results] = await db
            .query(
                "INSERT INTO danamasuk (tahun, bulan, jumlah, sumber, keterangan) VALUES (?, ?, ?, ?, ?)",
                [tahun, bulan, jumlah, sumber, keterangan]
            );
        return { id: results.insertId, tahun, bulan, jumlah, sumber, keterangan };
    } catch (error) {
        throw error;
    }
};

const addDanaKeluar = async (tahun, bulan, jumlah, kategori, keterangan) => {
    try {
        const [results] = await db
            .query(
                "INSERT INTO danakeluar (tahun, bulan, jumlah, kategori, keterangan) VALUES (?, ?, ?, ?, ?)",
                [tahun, bulan, jumlah, kategori, keterangan]
            );
        return { id: results.insertId, tahun, bulan, jumlah, kategori,keterangan };
    } catch (error) {
        throw error;
    }
};

const getAllDanaMasuk = async () => {
    try {
        const [result] = await db.query("SELECT * FROM danamasuk order by bulan asc")
        return result
    } catch (error) {
        throw error        
    }
}

const getAllDanaKeluar = async () => {
    try {
        const [result] = await db.query("SELECT * FROM danakeluar order by bulan asc")
        return result
    } catch (error) {
        throw error        
    }
}

const getDanaMasukById = async (id) => {
    try {
        const [result] = await db.query("SELECT * FROM danamasuk WHERE id = ?", [id]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw error;
    }
};

const getDanaKeluarById = async (id) => {
    try {
        const [result] = await db.query("SELECT * FROM danakeluar WHERE id = ?", [id]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw error;
    }
};

const getSummaryByYear = async (tahun) => {
    try {
        const [pemasukanRows] = await db.query(
            `SELECT 'Pemasukan' AS tipe, tahun, COALESCE(SUM(jumlah), 0) AS total 
            FROM danamasuk 
            WHERE tahun = ? 
            GROUP BY tahun`,
            [tahun]
        );

        const [pengeluaranRows] = await db.query(
            `SELECT 'Pengeluaran' AS tipe, tahun, COALESCE(SUM(jumlah), 0) AS total 
            FROM danakeluar 
            WHERE tahun = ? 
            GROUP BY tahun`,
            [tahun]
        );
        
        const result = [...pemasukanRows, ...pengeluaranRows];

        if (result.length === 0) {
            return [
                { tipe: "Pemasukan", tahun, total: 0 },
                { tipe: "Pengeluaran", tahun, total: 0 }
            ];
        }

        return result;
    } catch (error) {
        console.error("Error saat mengambil data APBDes:", error);
        throw error;
    }
};

const getDetailByYear = async (tahun) => {
    try {
        const [pendapatan] = await db.query(
            "SELECT bulan, SUM(jumlah) as total FROM danamasuk WHERE tahun = ? GROUP BY bulan ORDER BY bulan",
            [tahun]
        );

        const [pengeluaran] = await db.query(
            "SELECT bulan, SUM(jumlah) as total FROM danakeluar WHERE tahun = ? GROUP BY bulan ORDER BY bulan",
            [tahun]
        );

        return { pendapatan, pengeluaran };
    } catch (error) {
        throw error;
    }
};

const updateDanaMasuk = async (id, tahun, bulan, jumlah, sumber, keterangan) => {
    try {
        const [result] = await db.query(
            "UPDATE danamasuk set tahun = ?, bulan = ?, jumlah = ?, sumber = ?, keterangan = ? where id = ? ", 
            [tahun, bulan, jumlah, sumber, keterangan, id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error
    }
}

const updateDanaKeluar = async (id, tahun, bulan, jumlah, kategori, keterangan) => {
    try {
        const [result] = await db.query(
            "UPDATE danakeluar set tahun = ?, bulan = ?, jumlah = ?, kategori = ?, keterangan = ? where id = ? ", 
            [tahun, bulan, jumlah, kategori, keterangan, id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error
    }
}

const deleteDanaMasuk = async (id) => {
    try {
        const [result] = await db.query("DELETE FROM danamasuk WHERE id = ?", [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

const deleteDanaKeluar = async (id) => {
    try {
        const [result] = await db.query("DELETE FROM danakeluar WHERE id = ?", [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

export default {
    addDanaMasuk,
    addDanaKeluar,
    getAllDanaKeluar, 
    getAllDanaMasuk,
    getSummaryByYear,
    getDetailByYear,
    getDanaKeluarById, 
    getDanaMasukById,
    updateDanaKeluar,
    updateDanaMasuk, 
    deleteDanaKeluar,
    deleteDanaMasuk};
