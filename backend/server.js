import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [process.env.FRONTEND_URL];

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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", router);

app.listen(
  port,
  () => console.log(`Server berjalan di port ${port}`),
  console.log("Allowed origins:", allowedOrigins)
);
