import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { dts } from 'rollup-plugin-dts';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es'
      }
    ],
    external: [
      /^lit*/,
      "@microsoft/signalr",
      "mobx",
      "marked"
    ],
    plugins: [
      resolve({
        exportConditions: ['node'],
        preferBuiltins: true,
      }),
      commonjs(), 
      typescript({
        declaration: false,
        declarationDir: undefined
      })
    ]
  },
  {
    input: 'types/src/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];