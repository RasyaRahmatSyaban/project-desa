import express from "express"
import pendudukController from "../controllers/pendudukController.js"
import authAdmin from "../middleware/authAdmin.js"

const router = express.Router()

router.get("/", authAdmin, pendudukController.getAllPenduduk)
router.get("/nik/:nik", authAdmin, pendudukController.getPendudukByNik)
router.post("/", authAdmin, pendudukController.addPenduduk)
router.put("/update", authAdmin, pendudukController.updateDataPenduduk)

router.delete("/delete/:nik", authAdmin, pendudukController.deleteDataPenduduk)
router.delete("/delete-semua-keluarga/:nik", authAdmin, pendudukController.deleteSemuaKeluarga)

router.get("/stats/total", pendudukController.getTotalPenduduk)
router.get("/stats/kepala-keluarga", pendudukController.getTotalKepalaKeluarga)
router.get("/stats/laki-laki", pendudukController.getTotalLakiLaki)
router.get("/stats/perempuan", pendudukController.getTotalPerempuan)
router.get("/stats/agama", pendudukController.getPendudukByAgama)
router.get("/stats/umur", pendudukController.getPendudukByUmur)

router.get("/kepalakeluarga/:id_kepalakeluarga", authAdmin, pendudukController.getPendudukByKepalaKeluarga)
router.get("/search/kepalakeluarga", authAdmin, pendudukController.searchPendudukByKepalaKeluarga)

export default router
