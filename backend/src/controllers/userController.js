import authServices from "../services/userServices.js";

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const data = await authServices.loginAdmin(email, password);
        res.status(200).json({success: true, data})
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

const update = async (req, res) => {
    try {
        const {nama, email, password} = req.body
        const result = await authServices.updateAdmin(nama, email, password)
        res.status(200).json({success: true, message: result.message})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default {login, update}; 