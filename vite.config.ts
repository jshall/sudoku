import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "",
  plugins: [react()],
  resolve: {
    alias: {
      Sudoku: path.resolve(__dirname, "./src/Sudoku"),
      components: path.resolve(__dirname, "./src/components"),
      utilities: path.resolve(__dirname, "./src/utilities"),
    },
  },
});
