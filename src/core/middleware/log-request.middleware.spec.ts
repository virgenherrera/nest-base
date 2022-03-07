import { NextFunction, Request, Response } from 'express';
import { LogRequestMiddleware } from './log-request.middleware';

jest.mock('@nestjs/common/services/logger.service', () => ({
  Logger: class {
    log = jest.fn();
  },
}));

describe(`UT:${LogRequestMiddleware.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    logRequest = 'Should log Request.',
    logRequestNoAgent = 'Should log Request without agent.',
  }

  let middleware: LogRequestMiddleware = null;

  beforeAll(() => {
    middleware = new LogRequestMiddleware();
  });

  it(should.createInstance, () => {
    expect(middleware).not.toBeNull();
    expect(middleware).toBeInstanceOf(LogRequestMiddleware);
  });

  it(should.logRequest, () => {
    const request = {
      method: 'mock-method',
      originalUrl: 'mock-originalUrl',
      get: jest
        .fn()
        .mockImplementation((arg: string) =>
          arg === 'content-length' ? 'mock-content-length' : 'mock-user-agent',
        ),
    } as any as Request;
    const response = {
      statusCode: 'mock-statusCode',
      get: jest.fn().mockReturnValue('mock-content-length'),
      on: jest
        .fn()
        .mockImplementation((_event: string, handler: () => void) => handler()),
    } as any as Response;
    const next = jest.fn() as NextFunction;

    expect(() => middleware.use(request, response, next)).not.toThrow();
    expect(next).toHaveBeenCalled();
  });

  it(should.logRequestNoAgent, () => {
    const request = {
      method: 'mock-method',
      originalUrl: 'mock-originalUrl',
      get: jest
        .fn()
        .mockImplementation((arg: string) =>
          arg === 'content-length' ? 'mock-content-length' : undefined,
        ),
    } as any as Request;
    const response = {
      statusCode: 'mock-statusCode',
      get: jest.fn().mockReturnValue('mock-content-length'),
      on: jest
        .fn()
        .mockImplementation((_event: string, handler: () => void) => handler()),
    } as any as Response;
    const next = jest.fn() as NextFunction;

    expect(() => middleware.use(request, response, next)).not.toThrow();
    expect(next).toHaveBeenCalled();
  });
});
