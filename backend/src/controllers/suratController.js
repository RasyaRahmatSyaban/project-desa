import suratServices from "../services/suratServices.js";

const addSuratMasuk = async (req, res) => {
  try {
    const { nomor_surat, pengirim, perihal, tanggal_terima } = req.body;
    const file = req.file ? req.file : null; // Jika ada file yang di-upload

    const result = await suratServices.addSuratMasuk(
      nomor_surat,
      pengirim,
      perihal,
      tanggal_terima,
      file
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Surat masuk berhasil ditambahkan",
        data: result,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addSuratKeluar = async (req, res) => {
  try {
    const { nomor_surat, penerima, perihal, tanggal_kirim } = req.body;
    const file = req.file ? req.file : null; // Jika ada file yang di-upload

    const result = await suratServices.addSuratKeluar(
      nomor_surat,
      penerima,
      perihal,
      tanggal_kirim,
      file
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Surat keluar berhasil ditambahkan",
        data: result,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllSuratMasuk = async (req, res) => {
  try {
    const data = await suratServices.getAllSuratMasuk();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSuratKeluar = async (req, res) => {
  try {
    const data = await suratServices.getAllSuratKeluar();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSuratMasukById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await suratServices.getSuratMasukById(id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getSuratKeluarById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await suratServices.getSuratKeluarById(id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateSuratMasuk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomor_surat, pengirim, perihal, tanggal_terima } = req.body;
    const file = req.file ? req.file : null;

    const updated = await suratServices.updateSuratMasuk(
      id,
      nomor_surat,
      pengirim,
      perihal,
      tanggal_terima,
      file
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Surat masuk tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Surat masuk berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSuratKeluar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomor_surat, penerima, perihal, tanggal_kirim } = req.body;
    const file = req.file ? req.file : null;

    const updated = await suratServices.updateSuratKeluar(
      id,
      nomor_surat,
      penerima,
      perihal,
      tanggal_kirim,
      file
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Surat keluar tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Surat keluar berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSuratMasuk = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await suratServices.deleteSuratMasuk(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Surat masuk tidak ditemukan" });
    }

    res.json({ success: true, message: "Surat masuk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSuratKeluar = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await suratServices.deleteSuratKeluar(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Surat keluar tidak ditemukan" });
    }

    res.json({ success: true, message: "Surat keluar berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  addSuratMasuk,
  getAllSuratMasuk,
  updateSuratMasuk,
  deleteSuratMasuk,
  getSuratMasukById,
  addSuratKeluar,
  getAllSuratKeluar,
  updateSuratKeluar,
  deleteSuratKeluar,
  getSuratKeluarById,
};
