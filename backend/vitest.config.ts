import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@controllers": path.resolve(__dirname, "./src/controllers"),
      "@middlewares": path.resolve(__dirname, "./src/middlewares"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@schema": path.resolve(__dirname, "./src/schema"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@middleware": path.resolve(__dirname, "./src/middleware"),
    },
  },
});
