/* eslint-disable */

const fusee = require('../../fusee').getJestConfig()

module.exports = {
  ...fusee,
  testPathIgnorePatterns: [...fusee.testPathIgnorePatterns, '/__tests__/data/'],
}
