import { useEffect, useState } from "react";
import AdminFormPopup from "../../components/admin/AdminFormPopup";
import { useNavigate } from "react-router-dom";
import AdminService from "../../services/admin/AdminService";
import TableAdmin from "../../components/admin/TableAdmin";
import { FaUserShield, FaPlus, FaTrash, FaExchangeAlt } from "react-icons/fa";
import { logout } from "../../services/user/authService";
import toast from "../../components/Toast";

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
  const [showAdd, setShowAdd] = useState(false);
  const [transferId, setTransferId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRoleFromToken();
    if (role !== "superadmin") {
      navigate("/admin/beranda", { replace: true });
    }
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getAllUsers();
      setUsers(data);
    } catch (e) {
      toast.error("Gagal memuat data admin.");
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
      toast.error("Tidak bisa menghapus superadmin.");
      return;
    }
    setConfirmDeleteId(user.id);
  };

  const confirmDelete = async () => {
    try {
      await AdminService.deleteUser(confirmDeleteId);
      toast.success("User berhasil dihapus.");
      setConfirmDeleteId(null);
      fetchUsers();
    } catch (e) {
      toast.error("Gagal menghapus user.");
    }
  };

  const handleTransfer = (idx) => {
    const user = users[idx];
    if (user.role === "superadmin") {
      toast.info("User ini sudah superadmin.");
      return;
    }
    setTransferId(user.id);
  };

  const confirmTransfer = async () => {
    try {
      await AdminService.transferSuperadmin(transferId);
      toast.success("Superadmin berhasil dipindahkan. Anda akan logout...");
      setTransferId(null);
      setTimeout(() => {
        logout();
      }, 1200);
    } catch (e) {
      toast.error("Gagal transfer superadmin.");
    }
  };

  const handleAddUser = async (formData) => {
    try {
      await AdminService.addUser(
        formData.nama,
        formData.email,
        formData.password,
        "admin"
      );
      setShowAdd(false);
      toast.success("User berhasil ditambahkan.");
      fetchUsers();
    } catch (e) {
      toast.error("Gagal menambah user. Email mungkin sudah terdaftar.");
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

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        onClick={() => {
          setShowAdd(true);
        }}
      >
        <FaPlus /> Tambah Admin
      </button>

      <AdminFormPopup
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAddUser}
      />

      {loading ? (
        <div className="text-center text-gray-500">Memuat data...</div>
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <p className="mb-4 text-center">
              Yakin ingin menghapus user ini? Aksi ini **tidak dapat
              dibatalkan**.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Transfer Modal */}
      {transferId && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <p className="mb-4 text-center">
              Yakin ingin memindahkan superadmin ke user ini? Anda akan
              **otomatis logout**.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmTransfer}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ya, Transfer
              </button>
              <button
                onClick={() => setTransferId(null)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
