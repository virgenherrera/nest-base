/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/

const reporters: any[] = ['default'];

if (process.argv.includes('--coverage')) {
  reporters.push([
    'jest-stare',
    {
      resultDir: `reports/html/test-execution`,
      resultJson: `test-execution.json`,
      reportTitle: `Tests Report`,
      reportHeadline: `Unit/Integration Test Report`,
      coverageLink: `../test-coverage/index.html`,
    },
  ]);
}

export default {
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main).ts',
    '!**/*.(builder|constants|dto|enum|interface|model|mock|module).ts',
    '!**/*.(model|schema).ts',
  ],
  coverageDirectory: `../reports/html/test-coverage`,
  coverageProvider: 'v8',
  coverageReporters: ['html-spa', 'text', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  maxWorkers: '95%',
  reporters,
  rootDir: 'src',
  testEnvironment: 'node',
  testMatch: ['**/*spec.ts'],
  transform: { '^.+\\.(t)s$': 'ts-jest' },
};
