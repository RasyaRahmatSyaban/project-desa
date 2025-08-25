import express from "express";
import aparaturController from "../controllers/aparaturController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/upload.js"; // tambahkan import upload

const router = express.Router();


router.get("/", aparaturController.getAllAparatur);
router.get("/:id", authAdmin, aparaturController.getAparaturById);
router.get("/nip/:nip", authAdmin, aparaturController.getAparaturByNip);
router.post("/", authAdmin, upload.single("foto"), aparaturController.addAparatur); // tambahkan upload.single
router.put("/:id", authAdmin, upload.single("foto"), aparaturController.updateAparatur); // tambahkan upload.single
router.delete("/:id", authAdmin, aparaturController.deleteAparatur);

export default router;