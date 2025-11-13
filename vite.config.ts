import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // Transform all `.svg` imports into React components by default
      include: ["**/*.svg", "**/*.svg?react"],
      // leave `?url` and other queries to Vite asset handling
      exclude: ["**/*.svg?url", "**/*.svg?raw"],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
