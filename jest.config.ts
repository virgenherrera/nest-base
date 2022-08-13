/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/
import type { Config } from '@jest/types';

const options: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main).ts',
    '!**/*.(builder|dto|enum|exception|interface|mock|module).ts',
    '!**/*.(model|schema).ts',
    '!**/__mocks__.ts',
  ],
  coverageDirectory: `../coverage/unit-test`,
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
  maxWorkers: '50%',
  rootDir: 'src',
  testEnvironment: 'node',
  testMatch: ['**/*spec.ts'],
  transform: { '^.+\\.(t)s$': 'ts-jest' },
  verbose: true,
};

export default options;
