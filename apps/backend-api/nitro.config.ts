import { resolve } from "path";

//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  preset: "vercel",
  output: {
    dir: resolve(__dirname, "../../.vercel/output"),
  },
  compatibilityDate: "2025-08-06",
  experimental: {
    wasm: true,
  },
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": process.env.WEB_CLIENT_URL || "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
    },
  },
});
