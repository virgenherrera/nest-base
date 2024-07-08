import { BaseConfig } from './jest.config';

export const e2eConfig: typeof BaseConfig = {
  ...BaseConfig,
  collectCoverageFrom: [
    ...BaseConfig.collectCoverageFrom,
    '!**/common/interceptors/*.interceptor.ts',
    '!**/*.(config|spec).ts',
    '!(dist|test|scripts)/**',
    '!src/utils/**',
  ],
  coverageDirectory: 'coverage/e2e',
  rootDir: './',
  globalSetup: '<rootDir>/test/setup.ts',
  globalTeardown: '<rootDir>/test/teardown.ts',
  testPathIgnorePatterns: [
    '/coverage/',
    '/dist/',
    '/node_modules/',
    '/public/',
    '/public/',
    '/src/',
  ],
  testRegex: '.e2e-spec.ts$',
};

export default e2eConfig;
