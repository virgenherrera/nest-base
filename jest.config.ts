/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/
import type { Config } from 'jest';

export const JestConfig: Config = {
  cache: false,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.(controller|filter|interceptor|pipe|service|util).ts',
    '!**/application/utils/*.ts',
  ],
  coverageDirectory: '../coverage/unit',
  coverageReporters: ['json', 'html-spa'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  detectOpenHandles: true,
  maxWorkers: '100%',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
};

export default JestConfig;
