/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/
import type { Config } from 'jest';

export const BaseConfig: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main).ts',
    '!**/*.(builder|config|constant|doc|dto|enum|exception|import|indicator|interceptor|interface|model|module|provider).ts',
    '!**/__mocks__.ts',
  ],
  coverageDirectory: '../coverage/unit',
  coverageProvider: 'v8',
  coverageReporters: ['clover', 'json', 'text', 'html-spa'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  maxWorkers: '100%',
  reporters: ['default', 'summary'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  verbose: false,
};

export default BaseConfig;
