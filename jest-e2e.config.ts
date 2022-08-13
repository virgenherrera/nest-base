import type { Config } from '@jest/types';
import baseOptions from './jest.config';

const options: Config.InitialOptions = {
  maxWorkers: baseOptions.maxWorkers,
  reporters: ['default', 'summary', 'github-actions'],
  rootDir: './test/groups',
  testEnvironment: baseOptions.testEnvironment,
  testRegex: '.e2e-spec.ts$',
  transform: baseOptions.transform,
  verbose: baseOptions.verbose,
};

export default options;
