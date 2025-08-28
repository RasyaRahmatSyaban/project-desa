import tokenHelpers from "../helpers/token.js";
import passHelpers from "../helpers/pass.js";
import userRepositories from "../repositories/userRepositories.js";
import { UserDTO } from "../dto/dto.js";

const loginAdmin = async (email, password) => {
  const user = await userRepositories.getUserByEmail(email);
  if (!user) throw new Error("Email tidak ditemukan!");

  const pwMatch = await passHelpers.comparePw(password, user.password);
  if (!pwMatch) throw new Error("Password salah!");

  // Update last_login
  const now = new Date();
  await userRepositories.updateLastLogin(user.id, now);

  // Buat token
  const token = tokenHelpers.generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Pastikan token dikirim dalam response
  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    last_login: now,
    token, // Token harus ada di dalam objek ini
  };
};

const updateAdmin = async (nama, email, password) => {
  const hashedPw = await passHelpers.hashPw(password);

  const updated = await userRepositories.updateUserByEmail(
    nama,
    email,
    hashedPw
  );
  if (!updated) throw new Error("Gagal memperbarui data admin!");

  const user = await userRepositories.getUserByEmail(email);
  return new UserDTO(user.id, user.nama, user.email, null);
};

const resetPassword = async (email) => {
  const newPassword = "@Bahontobungku123";
  const hashedPassword = await passHelpers.hashPw(newPassword);

  const success = await userRepositories.resetPasswordByEmail(
    email,
    hashedPassword
  );
  if (!success) throw new Error("Gagal mereset password!");

  return { message: "Password berhasil direset ke default." };
};

const registerUser = async (nama, email, password, role = "admin") => {
  if (!nama || !email || !password) throw new Error("Semua field wajib diisi!");
  const hashedPw = await passHelpers.hashPw(password);
  const userId = await userRepositories.addUser(nama, email, hashedPw, role);
  return new UserDTO(userId, nama, email, null, role, null);
};

const getAllUsers = async () => {
  const users = await userRepositories.getAllUsers();
  return users.map(
    (u) => new UserDTO(u.id, u.nama, u.email, null, u.role, u.last_login)
  );
};

const deleteUser = async (id) => {
  return await userRepositories.deleteUserById(id);
};

const transferSuperadmin = async (fromId, toId) => {
  return await userRepositories.transferSuperadmin(fromId, toId);
};

export default {
  loginAdmin,
  updateAdmin,
  resetPassword,
  registerUser,
  getAllUsers,
  deleteUser,
  transferSuperadmin,
};
