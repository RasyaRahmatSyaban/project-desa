import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // sesuaikan dengan direktori penyimpanan yang diinginkan
    cb(null, "D:/CODING/project-desa/frontend/public/storage");
  },
  filename: (req, file, cb) => {
    const prefix = req.uploadPrefix || "file";
    const uniqueSuffix = Date.now();
    const originalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${prefix}-${uniqueSuffix}-${originalName}`);
  },
});

// Filter file berdasarkan jenisnya
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    foto: ["image/jpeg", "image/png", "image/jpg"],
    video: ["video/mp4", "video/mkv", "video/webm"],
    dokumen: ["application/pdf"], // Hanya PDF yang diperbolehkan
  };

  // Cek apakah file yang diunggah sesuai dengan salah satu kategori
  const allAllowedTypes = [
    ...allowedTypes.foto,
    ...allowedTypes.video,
    ...allowedTypes.dokumen,
  ];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format tidak didukung! Hanya foto (jpg, png), video (mp4, mkv, webm), dan dokumen PDF yang diperbolehkan."
      ),
      false
    );
  }
};

// Middleware upload
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
