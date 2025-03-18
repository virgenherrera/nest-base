import { JestConfig } from './jest.config';

export const E2EConfig: typeof JestConfig = {
  ...JestConfig,
  collectCoverageFrom: [
    'src/**/*.(controller|filter|interceptor|pipe|service|util).ts',
    '!src/(application|common|utils)/**/*.ts',
  ],
  coverageDirectory: 'coverage/e2e',
  globalSetup: '<rootDir>/test/setup.ts',
  globalTeardown: '<rootDir>/test/teardown.ts',
  rootDir: '.',
  testRegex: '.*\\.e2e-spec\\.ts$',
};

export default E2EConfig;
