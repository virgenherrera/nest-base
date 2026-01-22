/** @jest-config-loader ts-node */
/** @jest-config-loader-options {"transpileOnly": true} */

/*
 * For a detailed explanation regarding each configuration property and type check visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import type { Config } from 'jest';

import { JestConfig } from './jest.config';

export class JestE2eConfig extends JestConfig implements Config {
  override rootDir = '.';
  override coverageDirectory = '<rootDir>/coverage/e2e';
  override coverageThreshold = {
    global: { branches: 60, functions: 100, lines: 89, statements: 90 },
    'src/app/filters/http-exception.filter.ts': {
      branches: 50,
      functions: 100,
      lines: 81,
      statements: 82,
    },
  };
  override globalSetup = '<rootDir>/test/utils/e2e.setup.ts';
  override testRegex = 'test/.*\\.e2e-spec\\.ts$';
}

export default new JestE2eConfig();
