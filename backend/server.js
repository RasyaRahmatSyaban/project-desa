import express from "express"
import cors from "cors"
import router from "./src/routes/index.js"
import "dotenv/config"
import path from "path"

const app = express()
const port = 3000

// Middleware untuk akses folder uploads
app.use("/uploads", express.static(path.resolve("uploads")))

// Update CORS configuration to include your ngrok URLs
app.use(
    cors({
        origin: [
        "http://localhost:5173", // Vite dev server
        "http://192.168.10.202:5173", //contoh url lan
        "https://45b1-180-247-44-189.ngrok-free.app", // Replace with your actual frontend ngrok URL
        "https://fb75-180-247-44-189.ngrok-free.app", // Your backend ngrok URL for testing
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
    }),
)

// Add middleware to handle ngrok browser warning
app.use((req, res, next) => {
    res.header("ngrok-skip-browser-warning", "true")
    next()
})

app.use(express.json())
app.use("/", router)

app.listen(port, () => console.log(`Server berjalan di port ${port}`))