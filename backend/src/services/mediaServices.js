import mediaRepo from "../repositories/mediaRepo.js";
import { mediaDTO } from "../dto/dto.js";

const allowedTypes = {
  foto: ["image/jpeg", "image/png", "image/jpg"],
  video: ["video/mp4", "video/mkv", "video/webm"],
  dokumen: ["application/pdf"],
};

const addMedia = async (nama, tipe, file, deskripsi, thumbnail) => {
  try {
    // Jika tipe adalah "dokumen" atau "foto", thumbnail boleh null
    if (
      !nama ||
      !tipe ||
      !file ||
      !deskripsi ||
      (tipe !== "dokumen" && tipe !== "foto" && !thumbnail)
    ) {
      throw new Error("Semua data wajib diisi!");
    }

    if (!allowedTypes[tipe]) {
      throw new Error("Tipe media yang ditambahkan tidak valid!");
    }

    if (!allowedTypes[tipe].includes(file.mimetype)) {
      throw new Error(
        `Format file yang ditambahkan tidak didukung untuk tipe ${tipe}`
      );
    }

    const result = await mediaRepo.addMedia(
      nama,
      tipe,
      file.filename,
      deskripsi,
      thumbnail ? thumbnail.filename : null
    );

    return new mediaDTO(
      result.id,
      result.nama,
      result.tipe,
      result.file,
      result.deskripsi,
      result.thumbnail
    );
  } catch (error) {
    console.error("service", error);
    throw error;
  }
};

const getAllMedia = async () => {
  const results = await mediaRepo.getAllMedia();
  return results.map(
    (media) =>
      new mediaDTO(
        media.id,
        media.nama,
        media.tipe,
        media.file,
        media.deskripsi,
        media.thumbnail
      )
  );
};

const getMediaById = async (id) => {
  const result = await mediaRepo.getMediaById(id);
  if (!result) {
    throw new Error("Media tidak ditemukan!");
  }
  return new mediaDTO(
    result.id,
    result.nama,
    result.tipe,
    result.file,
    result.deskripsi,
    result.thumbnail
  );
};

const updateMedia = async (id, nama, tipe, file, deskripsi, thumbnail) => {
  const existing = await mediaRepo.getMediaById(id);
  if (!existing) throw new Error("Media tidak ditemukan!");
  if (file && !allowedTypes[tipe].includes(file.mimetype)) {
    throw new Error(`Format file tidak didukung untuk tipe ${tipe}!`);
  }

  const updated = await mediaRepo.updateMedia(
    id,
    nama,
    tipe,
    file ? file.filename : existing.file,
    deskripsi,
    thumbnail ? thumbnail.filename : existing.thumbnail
  );
  return new mediaDTO(
    updated.id,
    updated.nama,
    updated.tipe,
    updated.file,
    updated.deskripsi,
    updated.thumbnail
  );
};

const deleteMedia = async (id) => {
  const existing = await mediaRepo.getMediaById(id);
  if (!existing) {
    throw new Error("Media tidak ditemukan!");
  }
  return await mediaRepo.deleteMedia(id);
};

export default {
  addMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
};
