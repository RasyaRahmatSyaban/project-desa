import db from "../config/database.js";

const getAllPenduduk = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        p.id,
        p.nama,
        p.nik,
        p.alamat,
        p.tanggalLahir,
        p.jenisKelamin,
        p.agama,
        p.id_kepalakeluarga,
        p.status,
        kk.nama as namaKepalaKeluarga,
        kk.nik as nikKepalaKeluarga
      FROM penduduk p 
      LEFT JOIN kepalakeluarga kk ON p.id_kepalakeluarga = kk.id
      ORDER BY p.id DESC
    `);
    return results;
  } catch (error) {
    throw error;
  }
};

const getPendudukByNik = async (nik) => {
  try {
    const [results] = await db.promise().query(
      `
      SELECT 
        p.id,
        p.nama,
        p.nik,
        p.alamat,
        p.tanggalLahir,
        p.jenisKelamin,
        p.agama,
        p.id_kepalakeluarga,
        p.status,
        kk.nama as namaKepalaKeluarga,
        kk.nik as nikKepalaKeluarga
      FROM penduduk p 
      LEFT JOIN kepalakeluarga kk ON p.id_kepalakeluarga = kk.id 
      WHERE p.nik = ?
      `,
      [nik]
    );
    return results.length ? results[0] : null;
  } catch (error) {
    throw error;
  }
};

const getPendudukById = async (id) => {
  try {
    const [results] = await db.promise().query(
      `
      SELECT 
        p.id,
        p.nama,
        p.nik,
        p.alamat,
        p.tanggalLahir,
        p.jenisKelamin,
        p.agama,
        p.id_kepalakeluarga,
        p.status,
        kk.nama as namaKepalaKeluarga,
        kk.nik as nikKepalaKeluarga
      FROM penduduk p 
      LEFT JOIN kepalakeluarga kk ON p.id_kepalakeluarga = kk.id 
      WHERE p.id = ?
      `,
      [id]
    );
    return results.length ? results[0] : null;
  } catch (error) {
    throw error;
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
  try {
    const [results] = await db
      .promise()
      .query(
        "INSERT INTO penduduk (nama, nik, alamat, tanggalLahir, jenisKelamin, agama, id_kepalakeluarga, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          nama,
          nik,
          alamat,
          tanggalLahir,
          jenisKelamin,
          agama,
          id_kepalakeluarga,
          status,
        ]
      );

    // Ambil data yang baru diinsert dengan JOIN
    const newId = results.insertId;
    const newData = await getPendudukById(newId);

    return (
      newData || {
        id: newId,
        nama,
        nik,
        alamat,
        tanggalLahir,
        jenisKelamin,
        agama,
        id_kepalakeluarga,
        status,
      }
    );
  } catch (error) {
    throw error;
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
  try {
    const [results] = await db
      .promise()
      .query(
        "UPDATE penduduk SET nama = ?, nik = ?, alamat = ?, tanggalLahir = ?, jenisKelamin = ?, agama = ?, id_kepalakeluarga = ?, status = ? WHERE nik = ?",
        [
          nama,
          newNik,
          alamat,
          tanggalLahir,
          jenisKelamin,
          agama,
          id_kepalakeluarga,
          status,
          oldNik,
        ]
      );
    return results;
  } catch (error) {
    throw error;
  }
};

const deleteDataPenduduk = async (nik) => {
  try {
    const [results] = await db
      .promise()
      .query("DELETE FROM penduduk WHERE nik = ?", [nik]);
    return results.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const getTotalPenduduk = async () => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT COUNT(*) AS total FROM penduduk");
    return results[0].total;
  } catch (error) {
    throw error;
  }
};

const getTotalKepalaKeluarga = async () => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT COUNT(*) AS total FROM kepalakeluarga");
    return results[0].total;
  } catch (error) {
    throw error;
  }
};

const getTotalLakiLaki = async () => {
  try {
    const [results] = await db
      .promise()
      .query(
        "SELECT COUNT(*) AS total FROM penduduk WHERE jenisKelamin = 'laki-laki'"
      );
    return results[0].total;
  } catch (error) {
    throw error;
  }
};

const getTotalPerempuan = async () => {
  try {
    const [results] = await db
      .promise()
      .query(
        "SELECT COUNT(*) AS total FROM penduduk WHERE jenisKelamin = 'perempuan'"
      );
    return results[0].total;
  } catch (error) {
    throw error;
  }
};

const getPendudukByAgama = async () => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT agama, COUNT(*) AS total FROM penduduk GROUP BY agama");
    return results;
  } catch (error) {
    throw error;
  }
};

const getPendudukByUmur = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, tanggalLahir, CURDATE()) <= 12 THEN 'Anak-anak'
          WHEN TIMESTAMPDIFF(YEAR, tanggalLahir, CURDATE()) <= 19 THEN 'Remaja'
          WHEN TIMESTAMPDIFF(YEAR, tanggalLahir, CURDATE()) <= 35 THEN 'Dewasa Muda'
          WHEN TIMESTAMPDIFF(YEAR, tanggalLahir, CURDATE()) <= 59 THEN 'Dewasa'
          ELSE 'Lansia'
        END AS kategori,
        COUNT(*) AS total
      FROM penduduk
      GROUP BY kategori
    `);
    return results;
  } catch (error) {
    throw error;
  }
};

const getPendudukByKepalaKeluarga = async (id_kepalakeluarga) => {
  try {
    const [results] = await db.promise().query(
      `
      SELECT 
        p.id,
        p.nama,
        p.nik,
        p.alamat,
        p.tanggalLahir,
        p.jenisKelamin,
        p.agama,
        p.id_kepalakeluarga,
        p.status,
        kk.nama as namaKepalaKeluarga,
        kk.nik as nikKepalaKeluarga
      FROM penduduk p 
      LEFT JOIN kepalakeluarga kk ON p.id_kepalakeluarga = kk.id 
      WHERE p.id_kepalakeluarga = ?
      ORDER BY p.nama ASC
      `,
      [id_kepalakeluarga]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

const searchPendudukByKepalaKeluarga = async (searchTerm) => {
  try {
    const [results] = await db.promise().query(
      `
      SELECT 
        p.id,
        p.nama,
        p.nik,
        p.alamat,
        p.tanggalLahir,
        p.jenisKelamin,
        p.agama,
        p.id_kepalakeluarga,
        p.status,
        kk.nama as namaKepalaKeluarga,
        kk.nik as nikKepalaKeluarga
      FROM penduduk p 
      LEFT JOIN kepalakeluarga kk ON p.id_kepalakeluarga = kk.id 
      WHERE kk.nama LIKE ? OR kk.nik LIKE ?
      ORDER BY kk.nama ASC, p.nama ASC
      `,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllPenduduk,
  getPendudukByNik,
  getPendudukById,
  addPenduduk,
  updateDataPenduduk,
  deleteDataPenduduk,
  getPendudukByAgama,
  getPendudukByUmur,
  getTotalKepalaKeluarga,
  getTotalLakiLaki,
  getTotalPenduduk,
  getTotalPerempuan,
  getPendudukByKepalaKeluarga,
  searchPendudukByKepalaKeluarga,
};
