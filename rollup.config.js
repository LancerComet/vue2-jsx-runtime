import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './lib/index.ts',

  output: [
    {
      file: './dist/jsx-runtime.js',
      format: 'commonjs'
    },
    {
      file: './dist/jsx-runtime.mjs',
      format: 'es'
    }
  ],

  plugins: [
    commonjs(),

    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'es5'
        },
        include: [
          'lib/**/*'
        ]
      }
    }),

    del({
      targets: 'dist/*'
    })
  ],

  external: [
    'change-case',
    '@vue/composition-api'
  ]
}
