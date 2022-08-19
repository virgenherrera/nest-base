import type { Config } from '@jest/types';
import { TestConfig } from './jest.config';

class E2EConfig extends TestConfig implements Config.InitialOptions {
  collectCoverageFrom = [
    ...this.collectCoverageFrom,
    '!**/env-config.service.ts',
    '!**/*.(config|spec).ts',
    '!(dist|test)/**',
    '!src/utils/**',
  ];
  coverageDirectory = `coverage/e2e`;
  reporters = ['default', 'summary', 'github-actions'];
  rootDir = './';
  testPathIgnorePatterns = [
    '/coverage/',
    '/dist/',
    '/node_modules/',
    '/public/',
    '/src/',
  ];
  testRegex: '.e2e-spec.ts$';
}

export default new E2EConfig();
