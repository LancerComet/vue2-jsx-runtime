import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import del from 'rollup-plugin-delete'

export default {
  input: './lib/index.ts',

  output: [
    {
      file: './dist/index.js',
      format: 'umd',
      name: 'MangaBridge'
    },
    {
      file: './dist/index.esm.js',
      format: 'es'
    }
  ],

  plugins: [
    commonjs(),

    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'es5',
        },
        include: [
          'lib/**/*'
        ]
      }
    }),

    del({
      targets: 'dist/*'
    })
  ]
}
