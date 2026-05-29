import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { HttpErrorFilter } from './http-exception.filter';

class HttpErrorFilterTestCase {
  static readonly handleHttpException =
    'Should format HttpException responses consistently.';
  static readonly handleUnknownError =
    'Should format unknown errors as 500 responses.';
  static readonly handleStringException =
    'Should format string-based HttpException responses.';
  static readonly handleCustomErrorLabel =
    'Should honor explicit error labels in HttpException responses.';
  static readonly handleMissingMessage =
    'Should fall back when HttpException response has no message.';
  static readonly handleUnknownStatus =
    'Should fall back to generic error label for unknown status.';
}

describe(`UT:${HttpErrorFilter.name}`, () => {
  const createHost = () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const response = { status, json };
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
    const response = { status, json };
    const request = {
      url: '/health',
      headers: {},
    };

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

  it(HttpErrorFilterTestCase.handleHttpException, () => {
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

  it(HttpErrorFilterTestCase.handleUnknownError, () => {
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

  it(HttpErrorFilterTestCase.handleStringException, () => {
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

  it(HttpErrorFilterTestCase.handleCustomErrorLabel, () => {
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

  it(HttpErrorFilterTestCase.handleMissingMessage, () => {
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

  it(HttpErrorFilterTestCase.handleUnknownStatus, () => {
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
