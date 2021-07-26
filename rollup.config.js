import serve from "rollup-plugin-serve";
import buble from "@rollup/plugin-buble";

const isDev = process.env.NODE_ENV !== 'production',
    pkg = require('./package.json'),
    external = Object.keys(pkg.dependencies)

export default {
  input: 'src/deepMerge.js',
  output: [
    {file: pkg.main, format: 'cjs', sourcemap: true, exports: 'auto'},
    {file: pkg.module, format: 'es', sourcemap: true}
  ],
  plugins: [buble(), isDev && serve('dist') || null],
  external: external
}