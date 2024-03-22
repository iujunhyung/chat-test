import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  envDir: __dirname,
  server: {
    port: 5173
  }
  // build: {
  //   minify: false,
  //   rollupOptions: {
  //     external: [
  //       /^lit*/,
  //       "@microsoft/signalr",
  //       "mobx",
  //       "marked",
  //       "@shoelace-style/shoelace",
  //     ],
  //   }
  // }
});