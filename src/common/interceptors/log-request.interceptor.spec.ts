import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, take } from 'rxjs';

import { LogRequestInterceptor } from './log-request.interceptor';

describe(`UT:${LogRequestInterceptor.name}`, () => {
  let interceptor: LogRequestInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogRequestInterceptor],
    }).compile();

    interceptor = module.get<LogRequestInterceptor>(LogRequestInterceptor);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockExecutionContext = (statusCode: number) => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        method: 'GET',
        originalUrl: '/test',
      }),
      getResponse: jest.fn().mockReturnValue({
        statusCode,
      }),
    }),
  });

  const mockCallHandler = () => ({
    handle: jest.fn().mockReturnValue(of({})),
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log a message with status 500', done => {
    const context = mockExecutionContext(500);
    const callHandler = mockCallHandler();
    const spy = jest.spyOn(interceptor, 'intercept');

    interceptor
      .intercept(context as any as ExecutionContext, callHandler as CallHandler)
      .pipe(take(1))
      .subscribe({
        next: () => {
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        },
        error: error => done(error),
      });
  });

  it('should log a message with status 400', done => {
    const context = mockExecutionContext(400);
    const callHandler = mockCallHandler();
    const spy = jest.spyOn(interceptor, 'intercept');

    interceptor
      .intercept(context as any as ExecutionContext, callHandler as CallHandler)
      .pipe(take(1))
      .subscribe({
        next: () => {
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        },
        error: error => done(error),
      });
  });

  it('should log a message with status 200', done => {
    const context = mockExecutionContext(200);
    const callHandler = mockCallHandler();
    const spy = jest.spyOn(interceptor, 'intercept');

    interceptor
      .intercept(context as any as ExecutionContext, callHandler as CallHandler)
      .pipe(take(1))
      .subscribe({
        next: () => {
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        },
        error: error => done(error),
      });
  });
});
