import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import "dotenv/config";
import path from "path";

const app = express();
const port = 3000;

const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://192.168.10.202:5173", //contoh url lan
  process.env.FRONTEND_URL,
];

console.log("ini env", process.env.FRONTEND_URL);
// Update CORS configuration to include your ngrok URLs
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  })
);

// Add middleware to handle ngrok browser warning
app.use((req, res, next) => {
  res.header("ngrok-skip-browser-warning", "true");
  next();
});

app.use(express.json());
app.use("/", router);

app.listen(
  port,
  () => console.log(`Server berjalan di port ${port}`),
  console.log("Allowed origins:", allowedOrigins)
);
