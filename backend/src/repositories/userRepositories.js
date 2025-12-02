import db from "../config/database.js";

const getUserByEmail = async (email) => {
  const [rows] = await db
    .query("SELECT * FROM user WHERE email = ?", [email]);
  if (rows.length === 0) return null;
  const { id, nama, password, role, last_login } = rows[0];
  return { id, nama, email, password, role, last_login };
};

const getAllUsers = async () => {
  const [rows] = await db
    .query("SELECT id, nama, email, role, last_login FROM user");
  return rows;
};

const deleteUserById = async (id) => {
  const [result] = await db
    .query("DELETE FROM user WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

const updateUserRole = async (id, role) => {
  const [result] = await db
    .query("UPDATE user SET role = ? WHERE id = ?", [role, id]);
  return result.affectedRows > 0;
};

const updateLastLogin = async (id, datetime) => {
  const [result] = await db
    .query("UPDATE user SET last_login = ? WHERE id = ?", [datetime, id]);
  return result.affectedRows > 0;
};

const transferSuperadmin = async (fromId, toId) => {
  // Set current superadmin to admin
  await db
    .query("UPDATE user SET role = 'admin' WHERE id = ?", [fromId]);
  // Set new superadmin
  await db
    .query("UPDATE user SET role = 'superadmin' WHERE id = ?", [toId]);
  return true;
};

const updateUserByEmail = async (nama, email, password) => {
  const [result] = await db
    .query("UPDATE user SET nama = ?, password = ? WHERE email = ?", [
      nama,
      password,
      email,
    ]);
  return result.affectedRows > 0;
};

const resetPasswordByEmail = async (email, newPassword) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User dengan email tersebut tidak ditemukan!");

  const [result] = await db
    .query("UPDATE user SET password = ? WHERE email = ?", [
      newPassword,
      email,
    ]);
  return result.affectedRows > 0;
};

const addUser = async (nama, email, password, role = "admin") => {
  // Cek apakah email sudah ada
  const existing = await getUserByEmail(email);
  if (existing) throw new Error("Email sudah terdaftar!");
  const [result] = await db
    .query(
      "INSERT INTO user (nama, email, password, role) VALUES (?, ?, ?, ?)",
      [nama, email, password, role]
    );
  return result.insertId;
};

export default {
  getUserByEmail,
  getAllUsers,
  deleteUserById,
  updateUserRole,
  updateLastLogin,
  transferSuperadmin,
  updateUserByEmail,
  resetPasswordByEmail,
  addUser,
};
