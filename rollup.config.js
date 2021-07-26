import nodeResolve from "@rollup/plugin-node-resolve";

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
    plugins: [nodeResolve()]
  }
]