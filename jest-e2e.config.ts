import { BaseConfig } from './jest.config';

export const e2eConfig: typeof BaseConfig = {
  ...BaseConfig,
  collectCoverage: false,
  rootDir: './test/',
  globalSetup: '<rootDir>/setup.ts',
  globalTeardown: '<rootDir>/teardown.ts',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'E2E Test Report',
        outputPath: './coverage/e2e-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  testRegex: '.e2e-spec.ts$',
};

export default e2eConfig;
