import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "src/config"));
  const envWithStringifiedValues = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("VITE_"))
      .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)])
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
