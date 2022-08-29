import type { Config } from '@jest/types';
import { BaseConfig } from './jest.config';

export const e2eConfig: Config.InitialOptions = {
  ...BaseConfig,
  collectCoverageFrom: [
    ...BaseConfig.collectCoverageFrom,
    '!**/env-config.service.ts',
    '!**/*.(config|spec).ts',
    '!(dist|test)/**',
    '!src/utils/**',
  ],
  coverageDirectory: 'coverage/e2e',
  rootDir: './',
  testPathIgnorePatterns: [
    '/coverage/',
    '/dist/',
    '/node_modules/',
    '/public/',
    '/src/',
  ],
  testRegex: '.e2e-spec.ts$',
};

export default e2eConfig;
