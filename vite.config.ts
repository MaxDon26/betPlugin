import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import esbuild from "esbuild";
import fs from "fs";
import path from "path";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// Функция компиляции TS-файлов в JavaScript
async function buildBookmakers() {
  const srcDir = "src/bookmakers";
  const outDir = "dist/bookmakers";

  // Проверяем, существует ли директория `dist/bookmakers`, если нет — создаем
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Получаем список всех файлов `.ts` в папке `bookmakers`
  const files = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(srcDir, file));

  // Компилируем их с помощью esbuild
  await esbuild.build({
    entryPoints: files,
    outdir: outDir,
    format: "esm",
    bundle: false,
    sourcemap: false,
  });

  console.log("✅ Bookmakers scripts compiled successfully!");
}

export default defineConfig({
  plugins: [
    react(),

    webExtension({
      manifest: generateManifest,
    }),
    {
      name: "build-before-copy",
      async buildStart() {
        await buildBookmakers();
      },
    },
  ],
  build: {
    sourcemap: true, // Включает генерацию sourceMap для продакшн-сборки
  },
});
