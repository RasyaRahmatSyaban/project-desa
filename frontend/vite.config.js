import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// s://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "79e1478da770.ngrok-free.app",
      "localhost",
      /\.ngrok-free\.app$/,
    ],
  },
});
