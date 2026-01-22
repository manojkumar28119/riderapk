import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "src/config"));
  const envWithStringifiedValues = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("VITE_"))
      .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    base: "/",
    plugins: [
      react(),
      eslintPlugin({
        cache: false, // ✅ disable caching for development
        include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
        fix: true, // ✅ optional: auto-fix lint errors on save
        emitWarning: true, // ✅ Important: allow warnings
        emitError: false, // ✅ Don’t treat warnings as errors
        overrideConfig: {
          rules: {
            "@typescript-eslint/no-explicit-any": "off",
          },
        },
      }),
      VitePWA({
        registerType: "autoUpdate", // auto update SW
        injectRegister: "auto",
        strategies: "generateSW", // Changed from injectManifest to generateSW
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: "Rider App",
          short_name: "Rider",
          description: "Fast and reliable rider app",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          start_url: "/",
          display: "standalone",
          orientation: "portrait",
          icons: [
            {
              src: "/src/assets/images/Logo.jpg",
              sizes: "192x192",
              type: "image/jpeg",
            },
            {
              src: "/src/assets/images/Logo.jpg",
              sizes: "512x512",
              type: "image/jpeg",
            },
            {
              src: "/src/assets/images/Logo.jpg",
              sizes: "512x512",
              type: "image/jpeg",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    define: envWithStringifiedValues,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@app": path.resolve(__dirname, "./src/app"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@data": path.resolve(__dirname, "./src/data"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@styles": path.resolve(__dirname, "./src/styles"),
      },
    },
  };
});
