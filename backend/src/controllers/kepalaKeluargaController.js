import kepalaKeluargaService from "../services/kepalaKeluargaServices.js"

const getAllKepalaKeluarga = async (req, res) => {
  try {
    const data = await kepalaKeluargaService.getAllKepalaKeluarga()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getKepalaKeluargaById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await kepalaKeluargaService.getKepalaKeluargaById(id)
    if (!result) {
      return res.status(404).json({ success: false, message: "Kepala keluarga tidak ditemukan" })
    }
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getKepalaKeluargaByNik = async (req, res) => {
  const { nik } = req.params
  try {
    const result = await kepalaKeluargaService.getKepalaKeluargaByNik(nik)
    if (!result) {
      return res.status(404).json({ success: false, message: "Kepala keluarga tidak ditemukan" })
    }
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export default {
  getAllKepalaKeluarga,
  getKepalaKeluargaById,
  getKepalaKeluargaByNik,
}
