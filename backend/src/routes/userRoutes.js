import express from "express";
import authController from "../controllers/userController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Route login admin
router.post("/login", authController.login);

// Route update admin berdasarkan email (hanya bisa diakses admin)
router.put("/update", authAdmin, authController.update);

// Route tambah user/admin baru (hanya admin)
router.post("/add", authAdmin, authController.addUser);

router.post("/reset-password", authController.resetPasswordController);

// Admin management routes (superadmin only)
router.get("/all", authAdmin, authController.getAllUsers);
router.delete("/:id", authAdmin, authController.deleteUser);
router.post(
  "/transfer-superadmin",
  authAdmin,
  authController.transferSuperadmin
);

export default router;
