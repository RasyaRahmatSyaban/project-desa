import HeaderAdmin from "../../components/admin/HeaderAdmin";
import SettingAdminComp from "../../components/admin/SettingAdminComp";
import { useNavigate } from "react-router-dom";

export default function SettingAdmin() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "poppins" }}>
      <SettingAdminComp />
    </div>
  );
}
