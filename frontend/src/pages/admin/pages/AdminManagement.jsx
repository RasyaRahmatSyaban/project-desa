import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../services/AdminService";
import TableAdmin from "../../../components/admin/TableAdmin";
import {
  FaUserShield,
  FaTrash,
  FaExchangeAlt,
  FaPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { logout } from "../../user/authService";

function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

export default function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    nama: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [transferId, setTransferId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect if not superadmin
  useEffect(() => {
    const role = getRoleFromToken();
    if (role !== "superadmin") {
      navigate("/admin/beranda", { replace: true });
    }
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await AdminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Gagal memuat data admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (idx) => {
    const user = users[idx];
    if (user.role === "superadmin") {
      setError("Tidak bisa menghapus superadmin.");
      return;
    }
    setConfirmDeleteId(user.id);
  };

  const confirmDelete = async () => {
    try {
      await AdminService.deleteUser(confirmDeleteId);
      setSuccessMsg("User berhasil dihapus.");
      setConfirmDeleteId(null);
      fetchUsers();
    } catch (err) {
      setError("Gagal menghapus user.");
    }
  };

  const handleTransfer = (idx) => {
    const user = users[idx];
    if (user.role === "superadmin") {
      setError("User ini sudah superadmin.");
      return;
    }
    setTransferId(user.id);
  };

  const confirmTransfer = async () => {
    try {
      await AdminService.transferSuperadmin(transferId);
      setSuccessMsg("Superadmin berhasil dipindahkan. Anda akan logout...");
      setTransferId(null);
      setTimeout(() => {
        logout();
      }, 1200);
    } catch (err) {
      setError("Gagal transfer superadmin.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await AdminService.addUser(
        newUser.nama,
        newUser.email,
        newUser.password,
        newUser.role
      );
      setShowAdd(false);
      setNewUser({ nama: "", email: "", password: "", role: "admin" });
      setSuccessMsg("User berhasil ditambahkan.");
      fetchUsers();
    } catch (err) {
      setError("Gagal menambah user. Email mungkin sudah terdaftar.");
    }
  };

  const columns = ["id", "nama", "email", "role", "last_login"];
  const data = users.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    role: u.role,
    last_login: u.last_login ? new Date(u.last_login).toLocaleString() : "-",
  }));

  return (
    <div className="p-6" style={{ fontFamily: "poppins" }}>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaUserShield /> Manajemen Admin
      </h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {successMsg && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {successMsg}
        </div>
      )}
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        onClick={() => setShowAdd(!showAdd)}
      >
        <FaPlus /> Tambah Admin
      </button>
      {showAdd && (
        <form
          onSubmit={handleAddUser}
          className="mb-4 flex gap-2 flex-wrap items-end"
        >
          <input
            type="text"
            placeholder="Nama"
            value={newUser.nama}
            onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Simpan
          </button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TableAdmin
          columns={columns}
          data={data}
          onDelete={handleDelete}
          onTransfer={handleTransfer}
        />
      )}
      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Yakin ingin menghapus user ini?</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Transfer Modal */}
      {transferId && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Yakin ingin memindahkan superadmin ke user ini?</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={confirmTransfer}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ya, Transfer
              </button>
              <button
                onClick={() => setTransferId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
