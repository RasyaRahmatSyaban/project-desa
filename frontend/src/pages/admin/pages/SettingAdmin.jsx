import HeaderAdmin from "../components/HeaderAdmin";
import SettingAdminComp from "../components/SettingAdminComp";
import { useNavigate } from "react-router-dom";

export default function SettingAdmin() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "poppins" }}>
      <SettingAdminComp />
    </div>
  );
}
