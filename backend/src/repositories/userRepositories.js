import db from "../config/database.js";

const getUserByEmail = async (email) => {
    const [rows] = await db.promise().query(
        "SELECT * FROM user where email = ?", [email]
    );
    if(rows.length === 0) return null;

    const {id, nama, password} = rows[0];
    return {id: id, nama: nama, email: email, password: password};
}

const updateUserByEmail = async (nama, email, password) => {
    const user = await getUserByEmail(email)
    if(!user) throw new Error ("User dengan email tersebut tidak ditemukan!")

    const [result] = await db.promise().query(
        "UPDATE user SET nama = ?, password = ? WHERE email = ?", 
        [nama, password, email]
    );
    return result.affectedRows > 0;
}

const resetPasswordByEmail = async (email, newPassword) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("User dengan email tersebut tidak ditemukan!");

    const [result] = await db.promise().query(
        "UPDATE user SET password = ? WHERE email = ?", 
        [newPassword, email]
    );
    return result.affectedRows > 0;
};

export default { getUserByEmail, updateUserByEmail, resetPasswordByEmail };
