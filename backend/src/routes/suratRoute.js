import express from "express";
import upload from "../middleware/upload.js";
import suratController from "../controllers/suratController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

const setSuratPrefix = (req, res, next) => {
  req.uploadPrefix = "surat";
  next();
};


router.post("/addSuratMasuk", upload.single("file_surat"), authAdmin, suratController.addSuratMasuk);
router.post("/addSuratKeluar", upload.single("file_surat"), authAdmin, suratController.addSuratKeluar);
router.get("/suratMasuk", suratController.getAllSuratMasuk);
router.get("/suratKeluar", suratController.getAllSuratKeluar);
router.get("/surat-masuk/:id", suratController.getSuratMasukById);
router.get("/surat-keluar/:id", suratController.getSuratKeluarById);
router.put("/update-surat-masuk/:id", setSuratPrefix, upload.single("file_surat"), authAdmin, suratController.updateSuratMasuk);
router.put("/update-surat-keluar/:id", setSuratPrefix, upload.single("file_surat"), authAdmin, suratController.updateSuratKeluar);
router.delete("/delete-surat-masuk/:id", authAdmin, suratController.deleteSuratMasuk);
router.delete("/delete-surat-keluar/:id", authAdmin, suratController.deleteSuratKeluar);
export default router;
