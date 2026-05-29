/** @jest-config-loader ts-node */
/** @jest-config-loader-options {"transpileOnly": true} */

/*
 * For a detailed explanation regarding each configuration property and type check visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import type { Config } from 'jest';

export class JestConfig implements Config {
  cache = false;
  collectCoverage = true;
  collectCoverageFrom = [
    '<rootDir>/src/**/*.(controller|filter|guard|middleware|pipe|service|util).ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/(index|main).ts',
  ];
  coverageDirectory = '<rootDir>/coverage';
  coverageReporters: Config['coverageReporters'] = ['html-spa'];
  coverageThreshold = {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  };
  detectOpenHandles = true;
  globalSetup = '<rootDir>/test/utils/test.setup.ts';
  moduleFileExtensions = ['js', 'json', 'ts'];
  reporters = ['default', 'summary', 'github-actions'];
  rootDir = '.';
  testEnvironment = 'node';
  testRegex = '(src|test)/.*\\.(spec|e2e-spec)\\.ts$';
  testTimeout = 3e3;
  transform = { '^.+\\.ts$': 'ts-jest' };
  verbose = true;
}

export default new JestConfig();
