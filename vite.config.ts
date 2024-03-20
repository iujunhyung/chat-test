import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  envDir: __dirname,
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