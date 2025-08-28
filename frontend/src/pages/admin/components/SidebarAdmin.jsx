"use client";

import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaNewspaper,
  FaBullhorn,
  FaChartPie,
  FaPhotoVideo,
  FaEnvelope,
  FaLink,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaUserTie,
  FaUserShield,
} from "react-icons/fa";
import LogoutAdminDialog from "./LogoutAdminDialog";

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

export default function ModernSidebarAdmin() {
  // Ambil nama user dari localStorage, fallback ke 'Admin'
  const userNama = localStorage.getItem("userNama") || "Admin";
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navigateToSettings = () => {
    navigate("/admin/setting");
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  // Menu items array for easier management
  const menuItems = [
    { path: "/admin/beranda", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/aparat", icon: <FaUserTie />, label: "Aparat" },
    { path: "/admin/infografis", icon: <FaChartPie />, label: "Infografis" },
    { path: "/admin/pelayanan", icon: <FaLink />, label: "Pelayanan" },
    { path: "/admin/media", icon: <FaPhotoVideo />, label: "Media" },
    { path: "/admin/surat", icon: <FaEnvelope />, label: "Surat" },
    { path: "/admin/berita", icon: <FaNewspaper />, label: "Berita" },
    { path: "/admin/pengumuman", icon: <FaBullhorn />, label: "Pengumuman" },
  ];
  const role = getRoleFromToken();
  if (role === "superadmin") {
    menuItems.push({
      path: "/admin/manajemen-admin",
      icon: <FaUserShield />,
      label: "Manajemen Admin",
    });
  }

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add animation classes when the component mounts
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.add("sidebar-enter");
    }
  }, []);

  return (
    <div className="relative h-screen" style={{ fontFamily: "poppins" }}>
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white transition-all duration-300 ease-in-out z-10 overflow-y-scroll scrollbar-hide ${
          collapsed ? "w-20" : "w-72"
        } shadow-2xl overflow-y-auto`}
      >
        {/* Header with logo */}
        <div className="relative p-4 border-b border-indigo-800/30">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <FaUser />
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
                  {userNama}
                </h2>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full bg-indigo-800/30 hover:bg-indigo-700/50 hover:rotate-180 transition-transform duration-300"
            >
              {collapsed ? (
                <FaChevronRight size={14} />
              ) : (
                <FaChevronLeft size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Only show when not collapsed */}
        {!collapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-indigo-900/30 border border-indigo-800/30 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300/70" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="px-3 py-2">
          {!collapsed && (
            <h3 className="text-xs font-semibold uppercase text-indigo-300/70 px-3 mb-2">
              Menu
            </h3>
          )}
          <nav className={`${collapsed ? "space-y-4" : "space-y-1"}`}>
            {filteredMenuItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `menu-item group flex items-center ${
                    collapsed ? "justify-center" : "justify-start"
                  } gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg shadow-indigo-900/30"
                      : "text-indigo-200 hover:bg-indigo-800/30 hover:text-white"
                  }`
                }
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <span
                  className={`text-lg ${
                    location.pathname === item.path ? "animate-pulse" : ""
                  }`}
                >
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap z-20 shadow-lg">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t border-indigo-800/30 ${
            collapsed ? "flex justify-center" : ""
          }`}
        >
          {collapsed ? (
            <div className="flex flex-col gap-4">
              <button
                onClick={navigateToSettings}
                className="p-2 text-indigo-200 hover:text-white transition-colors"
              >
                <FaCog />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-indigo-200 hover:text-white transition-colors"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <button
                onClick={navigateToSettings}
                className="p-2 text-indigo-200 hover:text-white transition-colors"
              >
                <FaCog />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-indigo-200 hover:text-white transition-colors"
              >
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content area - adjust margin based on sidebar state */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Your main content goes here */}
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <LogoutAdminDialog onClose={() => setShowLogoutDialog(false)} />
      )}
    </div>
  );
}
