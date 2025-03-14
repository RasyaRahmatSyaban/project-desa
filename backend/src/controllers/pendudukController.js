import pendudukServices from "../services/pendudukServices.js";

const getAllPenduduk = async (req, res) => {
    try {
        const results = await pendudukServices.getAllPenduduk();
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPendudukByNik = async (req, res) => {
    const { nik } = req.params;
    try {
        const result = await pendudukServices.getPendudukByNik(nik);
        if (!result) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addPenduduk = async (req, res) => {
    const { nama, nik, alamat, tanggalLahir, jenisKelamin, agama, kepalaKeluarga } = req.body;
    try {
        const result = await pendudukServices.addPenduduk(nama, nik, alamat, tanggalLahir, jenisKelamin, agama, kepalaKeluarga);
        res.status(201).json({ success: true, message: "Data berhasil ditambahkan", data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateDataPenduduk = async (req, res) => {
    const { oldNik, newNik, nama, alamat, tanggalLahir , jenisKelamin, agama, kepalaKeluarga} = req.body;
    try {
        const result = await pendudukServices.updateDataPenduduk(oldNik, nama, newNik, alamat, tanggalLahir, jenisKelamin, agama, kepalaKeluarga);
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteDataPenduduk = async (req, res) => {
    const { nik } = req.params;
    try {
        const result = await pendudukServices.deleteDataPenduduk(nik);
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json({ success: true, message: "Data berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getTotalPenduduk = async (req, res) => {
    try {
        const result = await pendudukServices.getTotalPenduduk();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTotalKepalaKeluarga = async (req, res) => {
    try {
        const result = await pendudukServices.getTotalKepalaKeluarga();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTotalLakiLaki = async (req, res) => {
    try {
        const result = await pendudukServices.getTotalLakiLaki();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTotalPerempuan = async (req, res) => {
    try {
        const result = await pendudukServices.getTotalPerempuan();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPendudukByAgama = async (req, res) => {
    try {
        const result = await pendudukServices.getPendudukByAgama();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPendudukByUmur = async (req, res) => {
    try {
        const result = await pendudukServices.getPendudukByUmur();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default { getAllPenduduk, getPendudukByNik, addPenduduk, 
    updateDataPenduduk, deleteDataPenduduk, getPendudukByAgama, 
    getPendudukByUmur, getTotalKepalaKeluarga, getTotalLakiLaki, 
    getTotalPenduduk, getTotalPerempuan };