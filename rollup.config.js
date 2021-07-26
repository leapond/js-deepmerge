import serve from "rollup-plugin-serve";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: 'index.js',
    output: {
      file: 'public/index.browser.js',
      format: 'iife',
      sourcemap: true,
      name: 'deppMerge'
    },
    plugins: [commonjs(), nodeResolve(), serve('public')]
  },{
    input: 'index.js',
    output: {
      file: 'public/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [commonjs(), nodeResolve(), serve('public')]
  }
]