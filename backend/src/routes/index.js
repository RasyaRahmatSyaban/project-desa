import express from "express";
import pendudukRoutes from "./pendudukRoute.js";
import suratRoutes from "./suratRoute.js";
import authRoutes from "./userRoutes.js";
import pengumumanRoutes from "./pengumumanRoute.js";
import beritaRoutes from "./beritaRoute.js";
import danaRoute from "./danaRoute.js";
import mediaRoute from "./mediaRoute.js";
import pelayananRoute from "./pelayananRoute.js";
import aparaturRoute from "./aparaturRoute.js";
import * as chatbotController from "../controllers/chatbotController.js";

const router = express.Router();

// Gunakan semua route yang ada
router.use("/auth", authRoutes);
router.use("/penduduk", pendudukRoutes);
router.use("/surat", suratRoutes);
router.use("/pengumuman", pengumumanRoutes);
router.use("/berita", beritaRoutes);
router.use("/dana", danaRoute);
router.use("/media", mediaRoute);
router.use("/pelayanan", pelayananRoute);
router.use("/aparatur", aparaturRoute);
router.post("/chatbot", chatbotController.chatbot);
router.use("/pengumuman", pengumumanRoutes);

export default router;
