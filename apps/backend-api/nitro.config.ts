//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  preset: 'vercel',
  experimental: {
    wasm: true
  }
});
