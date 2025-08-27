import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import slugify from "slugify";

// Untuk mendapatkan __dirname di ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("Folder 'uploads' belum ada, sudah dibuat:", uploadPath);
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const prefix = req.uploadPrefix || "file";
    const uniqueSuffix = Date.now();

    // Dapatkan nama file tanpa ekstensi
    const fileName = path.parse(file.originalname).name;

    // Dapatkan ekstensi file (misal: .jpg, .png)
    const fileExtension = path.parse(file.originalname).ext;

    // Gunakan slugify hanya pada nama file, lalu tambahkan kembali ekstensinya
    const safeName = slugify(fileName, { lower: true, strict: true });

    cb(null, `${prefix}-${uniqueSuffix}-${safeName}${fileExtension}`);
  },
});

// Filter file berdasarkan jenisnya
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    foto: ["image/jpeg", "image/png", "image/jpg"],
    video: ["video/mp4", "video/mkv", "video/webm"],
    dokumen: ["application/pdf"],
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
