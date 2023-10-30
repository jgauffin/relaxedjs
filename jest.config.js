module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions:{
    url: 'https://jestjs.io/'
  },
  roots: ['<rootDir>'],
  testMatch: [
    "<rootDir>/tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(_spec|_test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ['ts-jest', {
      "tsconfig": "tsconfig.json",
      "babelConfig": false
    }]
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/jest/StandardLogger.ts',
    '<rootDir>/src/jest/decorators.ts'
  ],
  watchPlugins: [
    "<rootDir>/src/jest/DeltaWatchPlugin.js"
  ],
  "verbose": true
} 