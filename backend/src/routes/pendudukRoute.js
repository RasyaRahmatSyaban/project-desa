import express from "express";
import pendudukController from "../controllers/pendudukController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// CRUD Penduduk
router.get("/", authAdmin, pendudukController.getAllPenduduk);
router.get("/nik/:nik", authAdmin, pendudukController.getPendudukByNik);
router.post("/", authAdmin, pendudukController.addPenduduk);
router.put("/update", authAdmin, pendudukController.updateDataPenduduk);
router.delete("/delete/:nik", authAdmin, pendudukController.deleteDataPenduduk);
router.get(
  "/kepala-keluarga",
  authAdmin,
  pendudukController.getAllKepalaKeluarga
);

// Statistik Penduduk (tidak memerlukan autentikasi admin)
router.get("/stats/total", pendudukController.getTotalPenduduk);
router.get("/stats/kepala-keluarga", pendudukController.getTotalKepalaKeluarga);
router.get("/stats/laki-laki", pendudukController.getTotalLakiLaki);
router.get("/stats/perempuan", pendudukController.getTotalPerempuan);
router.get("/stats/agama", pendudukController.getPendudukByAgama);
router.get("/stats/umur", pendudukController.getPendudukByUmur);

export default router;
