import { Logger, ValueProvider } from '@nestjs/common';
import { Environment } from '../enums';
import { EnvConfigService } from './env-config.service';

export const mockLogger: Record<keyof Logger, any> = {
  log: () => jest.fn(),
  error: () => jest.fn(),
  warn: () => jest.fn(),
  debug: () => jest.fn(),
  verbose: () => jest.fn(),
  localInstance: () => jest.fn(),
};

export const mockEnvConfigService = {
  environment: Environment.test,
  port: 0,
  openApiPath: 'dist/fake-path/',
  get: jest.fn(),
};

export const MockLoggerProvider: ValueProvider = {
  provide: Logger,
  useValue: mockLogger,
};

export const MockEnvConfigProvider: ValueProvider = {
  provide: EnvConfigService,
  useValue: mockEnvConfigService,
};
