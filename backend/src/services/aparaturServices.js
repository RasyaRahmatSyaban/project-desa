import aparaturRepo from "../repositories/aparaturRepo.js";
import { AparaturDTO } from "../dto/dto.js";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.resolve("uploads");

function deleteOldFile(filename) {
  if (!filename) return;
  const oldFilePath = path.join(UPLOAD_DIR, filename);
  if (fs.existsSync(oldFilePath)) {
    fs.unlinkSync(oldFilePath);
  }
}

const getAllAparatur = async () => {
  try {
    const results = await aparaturRepo.getAllAparatur();
    return results.map(
      (a) =>
        new AparaturDTO(
          a.id,
          a.nama,
          a.nip,
          a.jabatan,
          a.telepon,
          a.foto,
          a.status
        )
    );
  } catch (error) {
    throw new Error("Gagal mengambil data aparatur: " + error.message);
  }
};

const getAparaturById = async (id) => {
  try {
    const result = await aparaturRepo.getAparaturById(id);
    if (!result) {
      return null;
    }
    return new AparaturDTO(
      result.id,
      result.nama,
      result.nip,
      result.jabatan,
      result.foto
    );
  } catch (error) {
    throw new Error("Gagal mengambil data aparatur berdasarkan ID");
  }
};

const getAparaturByNip = async (nip) => {
  try {
    const result = await aparaturRepo.getAparaturByNip(nip);
    if (!result) {
      return null;
    }
    return new AparaturDTO(
      result.id,
      result.nama,
      result.nip,
      result.jabatan,
      result.foto
    );
  } catch (error) {
    throw new Error("Gagal mengambil data aparatur berdasarkan NIP");
  }
};

const addAparatur = async (nama, nip, jabatan, foto) => {
  if (!nama || !nip || !jabatan) {
    throw new Error("Nama, NIP, dan Jabatan aparatur wajib diisi!");
  }

  const fotoPath = foto ? foto.filename : null;

  const existing = await aparaturRepo.getAparaturByNip(nip);
  if (existing) {
    throw new Error("NIP aparatur sudah terdaftar!");
  }

  try {
    const result = await aparaturRepo.addAparatur(nama, nip, jabatan, fotoPath);
    return new AparaturDTO(
      result.id,
      result.nama,
      result.nip,
      result.jabatan,
      result.foto
    );
  } catch (error) {
    throw new Error("Gagal menambahkan data aparatur anjay");
  }
};

const updateAparatur = async (id, nama, nip, jabatan, foto) => {
  const existing = await aparaturRepo.getAparaturById(id);
  if (!existing) throw new Error("Data aparatur tidak ditemukan!");

  if (nip !== existing.nip) {
    const existingByNip = await aparaturRepo.getAparaturByNip(nip);
    if (existingByNip) throw new Error("NIP aparatur sudah terdaftar!");
  }

  let fotoPath = existing.foto;
  if (foto) {
    deleteOldFile(existing.foto);
    fotoPath = foto.filename;
  }

  const updated = await aparaturRepo.updateAparatur(
    id,
    nama,
    nip,
    jabatan,
    fotoPath
  );
  return new AparaturDTO(
    updated.id,
    updated.nama,
    updated.nip,
    updated.jabatan,
    updated.foto
  );
};

const deleteAparatur = async (id) => {
  const existing = await aparaturRepo.getAparaturById(id);
  if (!existing) {
    throw new Error("Data aparatur tidak ditemukan");
  }

  try {
    const result = await aparaturRepo.deleteAparatur(id);
    return result;
  } catch (error) {
    throw new Error("Gagal menghapus data aparatur");
  }
};

export default {
  getAllAparatur,
  getAparaturById,
  getAparaturByNip,
  addAparatur,
  updateAparatur,
  deleteAparatur,
};
