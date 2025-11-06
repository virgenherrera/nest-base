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
  globalSetup = '<rootDir>/test/utils/e2e.setup.ts';
  override testRegex = 'test/.*\\.e2e-spec\\.ts$';
}

export default new JestE2eConfig();
