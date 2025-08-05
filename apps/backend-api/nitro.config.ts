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
  publicAssets: [
    {
      dir: resolve(__dirname, "../web-client/dist"),
      baseURL: "/",
      maxAge: 60 * 60 * 24 * 365,
    },
  ],
});
