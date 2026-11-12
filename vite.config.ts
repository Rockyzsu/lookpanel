import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

const headers = {
  "Content-Security-Policy": "frame-ancestors 'none'",
  "X-Frame-Options": "DENY",
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const escapeHtml = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char]!,
    );
  // Evaluated by Vite at build time, not when a visitor opens the page.
  const buildTime = new Date().toISOString();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "site-metadata",
        transformIndexHtml(html) {
          return html
            .replace(
              /<title>.*?<\/title>/,
              `<title>${escapeHtml(env.VITE_SITE_TITLE || "IP 查询与网络诊断")}</title>`,
            )
            .replace(
              /(<meta name="description" content=")[^"]*("\s*\/>)/,
              `$1${escapeHtml(env.VITE_SITE_DESCRIPTION || "IP 查询与网络诊断工具。")}$2`,
            )
            .replace(
              /(<meta name="apple-mobile-web-app-title" content=")[^"]*("\s*\/>)/,
              `$1${escapeHtml(env.VITE_SITE_BRAND || "ONE IP")}$2`,
            );
        },
      },
      {
        name: "app-build-version",
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "app-version.json",
            source: JSON.stringify({ build: buildTime }),
          });
        },
      },
    ],
    optimizeDeps: {
      include: ["vaul", "@fingerprintjs/fingerprintjs"],
    },
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    define: {
      "import.meta.env.VITE_BUILD_TIME": JSON.stringify(buildTime),
    },
    server: {
      host: "127.0.0.1",
      port: 5137,
      hmr: { clientPort: 8787 },
      strictPort: true,
      open: false,
      headers,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8787",
          changeOrigin: false,
        },
      },
    },
    preview: { headers },
  };
});
