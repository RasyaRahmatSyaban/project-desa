import express from "express";
import mediaController from "../controllers/mediaController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const setMediaPrefix = (req, res, next) => {
  req.uploadPrefix = "media";
  next();
};


router.get("/", mediaController.getAllMedia);
router.get("/:id", mediaController.getMediaById);
router.post(
  "/",
  authAdmin,
  setMediaPrefix,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  mediaController.addMedia
);
router.put(
  "/:id",
  authAdmin,
  setMediaPrefix,
  upload.single("file"),
  mediaController.updateMedia
);
router.delete(
  "/:id",
  authAdmin,
  setMediaPrefix,
  upload.single("file"),
  mediaController.deleteMedia
);

export default router;
