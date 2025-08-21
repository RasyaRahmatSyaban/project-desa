import aparaturService from "../services/aparaturServices.js"

const getAllAparatur = async (req, res) => {
  try {
    const data = await aparaturService.getAllAparatur()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAparaturById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await aparaturService.getAparaturById(id)
    if (!result) {
      return res.status(404).json({ success: false, message: "Aparatur tidak ditemukan" })
    }
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAparaturByNip = async (req, res) => {
  const { nip } = req.params
  try {
    const result = await aparaturService.getAparaturByNip(nip)
    if (!result) {
      return res.status(404).json({ success: false, message: "Aparatur tidak ditemukan" })
    }
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const addAparatur = async (req, res) => {
  const { nama, nip, jabatan } = req.body
  const foto = req.file

  try {
    const newAparatur = await aparaturService.addAparatur(nama, nip, jabatan, foto)
    res.status(201).json({ success: true, message: "Data aparatur berhasil ditambahkan", data: newAparatur })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const updateAparatur = async (req, res) => {
  const { id } = req.params
  const { nama, nip, jabatan } = req.body

  // Foto hanya diupdate jika ada file baru yang diupload
  const foto = req.file

  try {
    const updatedAparatur = await aparaturService.updateAparatur(id, nama, nip, jabatan, foto)
    res.json({ success: true, message: "Data aparatur berhasil diperbarui", data: updatedAparatur })
  } catch (error) {
    console.error("Update error:", error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}

const deleteAparatur = async (req, res) => {
  const { id } = req.params
  try {
    const deletedAparatur = await aparaturService.deleteAparatur(id)
    if (!deletedAparatur) {
      return res.status(404).json({ success: false, message: "Aparatur tidak ditemukan" })
    }
    res.json({ success: true, message: "Aparatur berhasil dihapus" })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export default {
  getAllAparatur,
  getAparaturById,
  getAparaturByNip,
  addAparatur,
  updateAparatur,
  deleteAparatur,
}
