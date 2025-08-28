import { Outlet } from "react-router-dom";
import SidebarAdmin from "./components/SidebarAdmin";
import HeaderAdmin from "./components/HeaderAdmin";

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
