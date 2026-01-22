import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { HttpErrorFilter } from './http-exception.filter';

describe(`UT:${HttpErrorFilter.name}`, () => {
  const enum should {
    handleHttpException = 'Should format HttpException responses consistently.',
    handleUnknownError = 'Should format unknown errors as 500 responses.',
  }

  const createHost = () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const response = { status, json } as unknown as {
      status: jest.Mock;
      json: jest.Mock;
    };
    const request = {
      url: '/health',
      headers: { 'x-request-id': 'req-123' },
    } as unknown as { url: string; headers: Record<string, string> };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost;

    return { host, response };
  };
  const createHostWithoutRequestId = () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const response = { status, json } as unknown as {
      status: jest.Mock;
      json: jest.Mock;
    };
    const request = {
      url: '/health',
      headers: {},
    } as unknown as { url: string; headers: Record<string, string> };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost;

    return { host, response };
  };

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(should.handleHttpException, () => {
    const filter = new HttpErrorFilter();
    const { host, response } = createHost();

    const exception = new BadRequestException(['Invalid payload']);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: ['Invalid payload'],
        path: '/health',
        requestId: 'req-123',
        timestamp: expect.any(String),
      }),
    );
  });

  it(should.handleUnknownError, () => {
    const filter = new HttpErrorFilter();
    const { host, response } = createHost();

    filter.catch(new Error('boom'), host);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
        message: ['Internal server error'],
        path: '/health',
        requestId: 'req-123',
        timestamp: expect.any(String),
      }),
    );
  });

  it('Should format string-based HttpException responses.', () => {
    const filter = new HttpErrorFilter();
    const { host, response } = createHostWithoutRequestId();

    filter.catch(new BadRequestException('Invalid input'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: ['Invalid input'],
        path: '/health',
        timestamp: expect.any(String),
      }),
    );
  });

  it('Should honor explicit error labels in HttpException responses.', () => {
    const filter = new HttpErrorFilter();
    const { host, response } = createHost();

    filter.catch(
      new BadRequestException({ message: 'Nope', error: 'Custom Error' }),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Custom Error',
        message: ['Nope'],
      }),
    );
  });

  it('Should fall back when HttpException response has no message.', () => {
    const filter = new HttpErrorFilter();
    const { host, response } = createHost();

    filter.catch(new BadRequestException({ reason: 'oops' }), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ['Unexpected error'],
      }),
    );
  });

  it('Should fall back to generic error label for unknown status.', () => {
    const filter = new HttpErrorFilter();
    const { host, response } = createHost();

    filter.catch(new HttpException('raw', 499), host);

    expect(response.status).toHaveBeenCalledWith(499);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Error',
      }),
    );
  });
});
