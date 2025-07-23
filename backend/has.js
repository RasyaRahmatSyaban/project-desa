import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const hashedPw = await bcrypt.hash(password, 10); // 10 adalah salt rounds
  console.log("Password Terhash:", hashedPw);
};

hashPassword("bahontobungku123");
