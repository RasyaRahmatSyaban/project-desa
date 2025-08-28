"use client";

import { useState, useEffect } from "react";
import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoutAdminDialog from "./LogoutAdminDialog";

export default function HeaderAdmin() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const navigateToSettings = () => {
    navigate("/admin/setting");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setShowDropdown(false);
  };

  // Format date and time
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentTime);

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header
      className="w-full bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-800 shadow-xl px-6 py-4 text-white"
      style={{ fontFamily: "poppins" }}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Title and decorative elements */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-10 w-1.5 rounded-full hidden md:block"></div>
          <div>
            <h1 className="text-xl font-bold flex items-center">
              Dashboard Admin
              <span className="ml-2 bg-indigo-700/50 text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                Pro
              </span>
            </h1>
            <div className="text-sm text-indigo-200 hidden md:block">
              Selamat datang kembali di panel admin
            </div>
          </div>
        </div>

        {/* Center - Date and Time */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center space-x-2 text-white">
            <span className="font-medium">{formattedTime}</span>
          </div>
          <div className="text-xs text-indigo-200">{formattedDate}</div>
        </div>

        {/* Right side - User profile */}
        <div className="relative">
          <button
            className="flex items-center gap-3 hover:bg-indigo-800/50 p-2 rounded-xl transition-colors border border-transparent hover:border-indigo-700"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex flex-col items-end mr-2 md:block">
              <span className="text-white font-medium">Admin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-indigo-900 p-1 ring-2 ring-indigo-300/30">
              <div className="w-full h-full rounded-full bg-indigo-900 flex items-center justify-center text-white">
                <FaUser />
              </div>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-indigo-950 rounded-xl shadow-lg py-2 z-10 border border-indigo-800/30">
              <div className="px-4 py-2 border-b border-indigo-800/30">
                <p className="text-sm font-medium text-white">Masuk sebagai</p>
                <p className="text-xs text-indigo-300">admin@example.com</p>
              </div>

              <div className="py-1">
                <button
                  onClick={navigateToSettings}
                  className="flex items-center gap-3 px-4 py-2 text-indigo-200 hover:bg-indigo-800/30 hover:text-white w-full text-left"
                >
                  <FaCog className="text-indigo-300" />
                  <span>Pengaturan</span>
                </button>
              </div>

              <div className="border-t border-indigo-800/30 my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-red-300 hover:bg-indigo-800/30 hover:text-red-200 w-full text-left"
              >
                <FaSignOutAlt className="text-red-300" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <LogoutAdminDialog onClose={() => setShowLogoutDialog(false)} />
      )}
    </header>
  );
}
