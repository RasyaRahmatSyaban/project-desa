import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../components/admin/SidebarAdmin";
import HeaderAdmin from "../../components/admin/HeaderAdmin";

export default function DashboardAdmin() {
  return (
    <div className="flex h-screen" style={{ fontFamily: "poppins" }}>
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
