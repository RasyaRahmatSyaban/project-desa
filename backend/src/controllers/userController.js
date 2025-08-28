import authServices from "../services/userServices.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Memanggil service loginAdmin yang mengembalikan user dan token
    const data = await authServices.loginAdmin(email, password);

    if (!data || !data.token) {
      return res.status(400).json({
        success: false,
        message: "Token tidak ditemukan dalam response!",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const result = await authServices.updateAdmin(nama, email, password);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const resetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email harus diisi!" });

    const response = await authServices.resetPassword(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const user = await authServices.registerUser(nama, email, password);
    res.status(201).json({
      success: true,
      message: "User berhasil ditambahkan",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Only superadmin can access
    if (req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Akses hanya untuk superadmin!" });
    }
    const users = await authServices.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Akses hanya untuk superadmin!" });
    }
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID user harus diisi!" });
    const result = await authServices.deleteUser(id);
    res.status(200).json({
      success: result,
      message: result ? "User dihapus." : "User tidak ditemukan.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const transferSuperadmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Akses hanya untuk superadmin!" });
    }
    const { toId } = req.body;
    const fromId = req.user.id;
    if (!toId)
      return res
        .status(400)
        .json({ success: false, message: "ID user baru harus diisi!" });
    await authServices.transferSuperadmin(fromId, toId);
    res
      .status(200)
      .json({ success: true, message: "Superadmin berhasil dipindahkan." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  login,
  update,
  resetPasswordController,
  addUser,
  getAllUsers,
  deleteUser,
  transferSuperadmin,
};
