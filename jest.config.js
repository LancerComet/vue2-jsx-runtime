module.exports = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  testEnvironment: 'jsdom',
  setupFiles: [
    '<rootDir>/.jest/setup.ts'
  ],
  moduleNameMapper: {
    // vue$: '<rootDir>/node_modules/vue/dist/vue.js',
    'vue2/jsx-runtime': ['<rootDir>/lib'],
    'vue2/jsx-dev-runtime': ['<rootDir>/lib']
  }
}
