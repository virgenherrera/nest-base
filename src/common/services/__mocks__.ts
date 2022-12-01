import { Logger, ValueProvider } from '@nestjs/common';
import { Environment } from '../enums';
import { EnvironmentService } from './environment.service';
import { HealthService } from './health.service';

export const mockLogger: Record<keyof Logger, any> = {
  log: () => jest.fn(),
  error: () => jest.fn(),
  warn: () => jest.fn(),
  debug: () => jest.fn(),
  verbose: () => jest.fn(),
  localInstance: () => jest.fn(),
};

export const MockLoggerProvider: ValueProvider = {
  provide: Logger,
  useValue: mockLogger,
};

export const mockEnvironmentService: Record<keyof EnvironmentService, any> = {
  environment: Environment.test,
  port: 0,
  openApiPath: 'dist/fake-path/',
};

export const MockEnvironmentProvider: ValueProvider = {
  provide: EnvironmentService,
  useValue: mockEnvironmentService,
};

export const mockHealthService: Record<keyof HealthService, any> = {
  getHealth: jest.fn(),
};

export const MockHealthServiceProvider: ValueProvider = {
  provide: HealthService,
  useValue: mockHealthService,
};
