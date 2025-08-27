import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// s://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "97be0e52190e.ngrok-free.app",
      "localhost",
      /\.ngrok-free\.app$/,
    ],
  },
});
