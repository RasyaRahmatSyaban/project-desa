import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test koneksi awal
db.getConnection()
  .then((connection) => {
    console.log("Terhubung ke Database");
    connection.release();
  })
  .catch((err) => {
    console.error("Koneksi ke database gagal:", err);
  });

// Optional error listener
db.on("error", (err) => {
  console.error("MySQL Pool Error:", err);
});

export default db;
