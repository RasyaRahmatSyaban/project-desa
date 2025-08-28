import { useEffect, useState } from "react";
import AdminFormPopup from "../components/AdminFormPopup";
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
  const [transferId, setTransferId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
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
    } catch {
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
    } catch {
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
    } catch {
      setError("Gagal transfer superadmin.");
    }
  };

  const handleAddUser = async (formData) => {
    setError("");
    try {
      await AdminService.addUser(
        formData.nama,
        formData.email,
        formData.password,
        "admin"
      );
      setShowAdd(false);
      setSuccessMsg("User berhasil ditambahkan.");
      fetchUsers();
    } catch {
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
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        onClick={() => setShowAdd(true)}
      >
        <FaPlus /> Tambah Admin
      </button>
      <AdminFormPopup
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAddUser}
      />
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
