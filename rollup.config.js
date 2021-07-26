import nodeResolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";

const isDev = process.env.NODE_ENV !== 'production'
export default [
  {
    input: 'src/deepMerge.js',
    output: {
      file: 'libs/deep-merge.browser.js',
      format: 'iife',
      sourcemap: false,
      name: 'deppMerge'
    },
    plugins: [nodeResolve()]
  }, {
    input: 'src/deepMerge.js',
    output: {
      file: 'libs/deep-merge.esm.js',
      format: 'es',
      sourcemap: false
    },
    plugins: [nodeResolve(), isDev && serve('libs') || null]
  }, {
    input: 'src/deepMerge.js',
    output: {
      file: 'libs/deep-merge.cjs.js',
      format: 'cjs',
      sourcemap: false
    },
    plugins: [nodeResolve()]
  }
]