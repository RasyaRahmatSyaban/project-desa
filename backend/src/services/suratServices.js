import suratRepo from "../repositories/suratRepo.js";
import { SuratMasukDTO, SuratKeluarDTO } from "../dto/dto.js";

const addSuratMasuk = async (nomorSurat, pengirim, perihal, tanggalTerima, file) => {
    if (!nomorSurat || !pengirim || !perihal || !tanggalTerima) {
        throw new Error("Semua data wajib diisi!");
    }

    const result = await suratRepo.addSuratMasuk(nomorSurat, pengirim, perihal, tanggalTerima, file.filename);
    return new SuratMasukDTO(result.id, result.nomorSurat, result.pengirim, result.perihal, result.tanggalTerima, result.file);
};

const addSuratKeluar = async (nomorSurat, penerima, perihal, tanggalKirim, file) => {
    if (!nomorSurat || !penerima || !perihal || !tanggalKirim) {
        throw new Error("Semua data wajib diisi!");
    }

    const result = await suratRepo.addSuratKeluar(nomorSurat, penerima, perihal, tanggalKirim, file.filename);
    return new SuratKeluarDTO(result.id, result.nomorSurat, result.penerima, result.perihal, result.tanggalKirim, result.file);
};

const getAllSuratMasuk = async () => {
    const results = await suratRepo.getAllSuratMasuk();
    return results.map(s => new SuratMasukDTO(s.id, s.nomorSurat, s.pengirim, s.perihal, s.tanggalTerima, s.file));
};

const getAllSuratKeluar = async () => {
    const results = await suratRepo.getAllSuratKeluar();
    return results.map(s => new SuratKeluarDTO(s.id, s.nomorSurat, s.penerima, s.perihal, s.tanggalKirim, s.file));
};

const getSuratMasukById = async (id) => {
    const result = await suratRepo.getSuratMasukById(id);
    if (!result) {
        throw new Error("Surat masuk tidak ditemukan!");
    }
    return new SuratMasukDTO(result.id, result.nomorSurat, result.pengirim, result.perihal, result.tanggalTerima, result.file);
};

const getSuratKeluarById = async (id) => {
    const result = await suratRepo.getSuratKeluarById(id);
    if (!result) {
        throw new Error("Surat keluar tidak ditemukan!");
    }
    return new SuratKeluarDTO(result.id, result.nomorSurat, result.penerima, result.perihal, result.tanggalKirim, result.file);
};

const updateSuratMasuk = async (id, nomorSurat, pengirim, perihal, tanggalTerima, file) => {
    const existing = await suratRepo.getSuratMasukById(id);
    if (!existing) {
        throw new Error("Surat tidak ditemukan");
    }

    const fileToSave = file || existing.file;

    const updated = await suratRepo.updateSuratMasuk(id, nomorSurat, pengirim, perihal, tanggalTerima, fileToSave);
    return updated;
};

const updateSuratKeluar = async (id, nomorSurat, penerima, perihal, tanggalKirim, file) => {
    const existing = await suratRepo.getSuratKeluarById(id);
    if (!existing) {
        throw new Error("Surat tidak ditemukan");
    }

    const fileToSave = file || existing.file;

    const updated = await suratRepo.updateSuratKeluar(id, nomorSurat, penerima, perihal, tanggalKirim, fileToSave);
    return updated;
};

const deleteSuratMasuk = async (id) => {
    const existing = await suratRepo.getSuratMasukById(id);
    if (!existing) {
        return false;
    }

    return await suratRepo.deleteSuratMasuk(id);
};

const deleteSuratKeluar = async (id) => {
    const existing = await suratRepo.getSuratKeluarById(id);
    if (!existing) {
        return false;
    }

    return await suratRepo.deleteSuratKeluar(id);
};

export default { 
    addSuratMasuk, getAllSuratMasuk, updateSuratMasuk, deleteSuratMasuk, getSuratMasukById,
    addSuratKeluar, getAllSuratKeluar, updateSuratKeluar, deleteSuratKeluar, getSuratKeluarById
};