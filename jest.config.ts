/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/
import type { Config } from 'jest';

export const BaseConfig: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main|openApi).ts',
    '!**/*.(builder|config|constant|dto|doc|enum|exception|import|indicator|interface|model|module|provider|schema).ts',
    '!**/__mocks__.ts',
  ],
  coverageDirectory: '../coverage/unit',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html-spa'],
  coverageThreshold: {
    global: { branches: 85, functions: 85, lines: 85, statements: 85 },
  },
  maxWorkers: '100%',
  reporters: ['default', 'summary', 'github-actions'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  verbose: false,
};

export default BaseConfig;
