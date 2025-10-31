/** @jest-config-loader ts-node */

/*
 * For a detailed explanation regarding each configuration property and type check visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import type { Config } from 'jest';

export class JestConfig implements Config {
  cache = false;
  collectCoverage = true;
  collectCoverageFrom = [
    '**/*.ts',
    '!**/(index|main).ts',
    '!**/*.(config|module).ts',
  ];
  coverageDirectory = '../coverage/unit';
  coverageReporters: Config['coverageReporters'] = ['html-spa'];
  coverageThreshold = {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  };
  detectOpenHandles = true;
  globalSetup = `<rootDir>/../test/utils/unit.setup.ts`;
  moduleFileExtensions = ['js', 'json', 'ts'];
  reporters = ['default', 'summary', 'github-actions'];
  rootDir = './src';
  testEnvironment = 'node';
  testRegex = '.*\\.spec\\.ts$';
  testTimeout = 3e3;
  transform = { '^.+\\.ts$': 'ts-jest' };
  verbose = true;
}

export default new JestConfig();
