import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Halaman Umum
import Home from "../pages/Home";
import ProfilDesa from "../pages/ProfilDesa";
import Infografis from "../pages/Infografis";
import Login from "../pages/Login";
import Reset from "../pages/ResetPassword";
import Pelayanan from "../pages/Pelayanan";
import Media from "../pages/Media";
import Arsip from "../pages/Arsip";
import Information from "../pages/Information";
import BeritaDetail from "../pages/BeritaDetail";
import Map from "../pages/Map";
// Admin Layout (Parent Admin)
import DashboardAdmin from "../pages/admin/DashboardAdmin";

// Halaman Admin (Children Pages)
import BerandaAdmin from "../pages/admin/pages/BerandaAdmin";
import BeritaAdmin from "../pages/admin/pages/BeritaAdmin";
import PengumumanAdmin from "../pages/admin/pages/PengumumanAdmin";
import InfografisAdmin from "../pages/admin/pages/InfografisAdmin";
import MediaAdmin from "../pages/admin/pages/MediaAdmin";
import SuratAdmin from "../pages/admin/pages/SuratAdmin";
import PelayananAdmin from "../pages/admin/pages/PelayananAdmin";
import SettingAdmin from "../pages/admin/pages/SettingAdmin";
import AparatAdmin from "../pages/admin/pages/AparatAdmin";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ===================== HALAMAN UMUM ===================== */}
        <Route path="/" element={<Home />} />
        <Route path="/ProfilDesa" element={<ProfilDesa />} />
        <Route path="/Infografis" element={<Infografis />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ResetPassword" element={<Reset />} />
        <Route path="/Pelayanan" element={<Pelayanan />} />
        <Route path="/Media" element={<Media />} />
        <Route path="/Arsip" element={<Arsip />} />
        <Route path="/Information" element={<Information />} />
        <Route path="/berita-detail/:id" element={<BeritaDetail />} />
        <Route path="/Map" element={<Map />} />

        {/* ===================== HALAMAN ADMIN DENGAN LAYOUT ===================== */}
        <Route path="/admin" element={<DashboardAdmin />}>
          <Route path="beranda" element={<BerandaAdmin />} />
          <Route path="aparat" element={<AparatAdmin />} />
          <Route path="berita" element={<BeritaAdmin />} />
          <Route path="pengumuman" element={<PengumumanAdmin />} />
          <Route path="infografis" element={<InfografisAdmin />} />
          <Route path="media" element={<MediaAdmin />} />
          <Route path="surat" element={<SuratAdmin />} />
          <Route path="pelayanan" element={<PelayananAdmin />} />
          <Route path="setting" element={<SettingAdmin />} />
        </Route>

        {/* ===================== HALAMAN NOT FOUND ===================== */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
