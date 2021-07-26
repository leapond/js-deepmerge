import nodeResolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import buble from "@rollup/plugin-buble";

const isDev = process.env.NODE_ENV !== 'production',
    pkg = require('./package.json'),
    external = pkg.dependencies

export default {
  input: 'src/deepMerge.js',
  output: [
    {file: pkg.main, format: 'cjs', sourcemap: true, exports: 'auto'},
    {file: pkg.module, format: 'es', sourcemap: true},
    {file: pkg.browser, format: 'iife', sourcemap: true, name: 'deepMerge'},
  ],
  plugins: [nodeResolve(), buble(), isDev && serve('dist') || null],
  external: external
}