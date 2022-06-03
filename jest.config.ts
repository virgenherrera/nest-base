/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/

export default {
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main).ts',
    '!**/*.(builder|dto|enum|interface|mock|module).ts',
    '!**/*.(model|schema).ts',
    '!**/__mocks__.ts',
  ],
  coverageDirectory: `../reports/test-coverage`,
  coverageProvider: 'v8',
  coverageReporters: ['html-spa', 'text'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  maxWorkers: '95%',
  rootDir: 'src',
  testEnvironment: 'node',
  testMatch: ['**/*spec.ts'],
  transform: { '^.+\\.(t)s$': 'ts-jest' },
};
