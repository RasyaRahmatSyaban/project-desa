// src/routes/AppRoutes.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProfilDesa from "../pages/ProfilDesa";
import Login from "../pages/Login";
import Reset from "../pages/ResetPassword";
import Transactions from "../pages/Transactions";
import Informasi from "../pages/Informasi";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProfilDesa" element={<ProfilDesa />} />
        <Route path="/Login" element={<Login />}/>
        <Route path="/ResetPassword" element={<Reset />}/>
        <Route path="/Transactions" element={<Transactions />}/>
        <Route path="/Informasi" element={<Informasi />}/>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
