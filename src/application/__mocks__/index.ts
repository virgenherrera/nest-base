import { Logger, ValueProvider } from '@nestjs/common';

export const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  localInstance: jest.fn(),
  fatal: jest.fn(),
} as unknown as Logger;

export const MockLoggerProvider: ValueProvider = {
  provide: Logger,
  useValue: mockLogger,
};
