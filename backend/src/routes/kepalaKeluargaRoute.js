import express from "express"
import kepalaKeluargaController from "../controllers/kepalaKeluargaController.js"
import authAdmin from "../middleware/authAdmin.js"

const router = express.Router()

router.get("/nik/:nik", authAdmin, kepalaKeluargaController.getKepalaKeluargaByNik)
router.get("/:id", authAdmin, kepalaKeluargaController.getKepalaKeluargaById)
router.get("/", authAdmin, kepalaKeluargaController.getAllKepalaKeluarga)

export default router
