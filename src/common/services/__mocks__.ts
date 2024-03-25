import { Logger, ValueProvider } from '@nestjs/common';

import { Environment } from '../enums';
import { EnvironmentService } from './environment.service';

export const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  localInstance: jest.fn(),
  fatal: jest.fn(),
} as const;

export const MockLoggerProvider: ValueProvider = {
  provide: Logger,
  useValue: mockLogger,
};

export const mockEnvironmentService = {
  environment: Environment.test,
  port: 0,
} as const;

export const MockEnvironmentProvider: ValueProvider = {
  provide: EnvironmentService,
  useValue: mockEnvironmentService,
};
