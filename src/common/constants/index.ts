import { Environment } from '../types';

export const Environments = [
  'DEVELOPMENT',
  'TEST',
  'E2E',
  'CI/CD',
  'QA',
  'UAT',
  'PRODUCTION',
] as const;

export const UpperEnvironments: Environment[] = ['PRODUCTION', 'UAT'];
