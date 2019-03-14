const devCore = require('@marvinroger/dev-core').getJestConfig()

module.exports = {
  ...devCore,
  testPathIgnorePatterns: [
    ...devCore.testPathIgnorePatterns,
    '/__tests__/data/',
  ],
}
