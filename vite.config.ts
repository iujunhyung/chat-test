import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: 'test',
  envDir: __dirname,
  build: {
    minify: false,
    outDir: 'dist',
    assetsDir: 'public',
    lib: {
      entry: 'src/index.ts', // 라이브러리의 진입점
      fileName: (format: string, entry: string) => {
        return `${entry}.${format}.js`;
      },
      formats: ['cjs', 'es'], // 빌드할 포맷
    },
    rollupOptions: {
      // 외부화할 종속성을 지정
      external: [
        /^lit*/,
        "@microsoft/signalr",
        "mobx",
        "marked",
      ],
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      }
    }
  },
  plugins: [
    dts({
      include: 'src/**/*',
    })
  ]
});