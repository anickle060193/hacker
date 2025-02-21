import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  base: "/hacker/",
  plugins: [react({ jsxImportSource: "@emotion/react" }), svgr()],
});
