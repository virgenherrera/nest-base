import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, take, throwError } from 'rxjs';

import { LogRequestInterceptor } from './log-request.interceptor';

describe(`UT:${LogRequestInterceptor.name}`, () => {
  let interceptor: LogRequestInterceptor = null;

  const enum should {
    init = 'Should be initialized properly.',
    shouldLog200 = 'should log a message with status 200',
    shouldHandleGeneric = 'Should log generic Error',
    shouldLog500 = 'should log a message with status 500',
    shouldLog400 = 'should log a message with status 400',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogRequestInterceptor],
    }).compile();

    interceptor = module.get(LogRequestInterceptor);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetAllMocks;
  });

  const getMockExecutionContext = (statusCode: number) => ({
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

  const getMockCallHandler = (expectedValue: any = {}) => ({
    handle: jest.fn().mockReturnValue(of(expectedValue)),
  });

  it(should.init, async () => {
    expect(interceptor).not.toBeNull();
    expect(interceptor).toBeInstanceOf(LogRequestInterceptor);
  });

  it(should.shouldLog200, done => {
    const context = getMockExecutionContext(200);
    const callHandler = getMockCallHandler();
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

  it(should.shouldHandleGeneric, done => {
    const context = getMockExecutionContext(500);
    const callHandler = getMockCallHandler();
    const spy = jest.spyOn(interceptor, 'intercept');

    jest
      .spyOn(callHandler, 'handle')
      .mockReturnValueOnce(throwError(() => new TypeError('Test error')));

    interceptor
      .intercept(context as any as ExecutionContext, callHandler as CallHandler)
      .pipe(take(1))
      .subscribe({
        error: error => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(error).toBeInstanceOf(TypeError);

          done();
        },
      });
  });

  it(should.shouldLog500, done => {
    const context = getMockExecutionContext(500);
    const callHandler = getMockCallHandler();
    const spy = jest.spyOn(interceptor, 'intercept');

    jest
      .spyOn(callHandler, 'handle')
      .mockReturnValueOnce(
        throwError(() => new InternalServerErrorException('Test error')),
      );

    interceptor
      .intercept(context as any as ExecutionContext, callHandler as CallHandler)
      .pipe(take(1))
      .subscribe({
        error: error => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(error).toBeInstanceOf(InternalServerErrorException);

          done();
        },
      });
  });

  it(should.shouldLog400, done => {
    const context = getMockExecutionContext(500);
    const callHandler = getMockCallHandler();
    const spy = jest.spyOn(interceptor, 'intercept');

    jest
      .spyOn(callHandler, 'handle')
      .mockReturnValueOnce(
        throwError(() => new BadRequestException('Test error')),
      );

    interceptor
      .intercept(context as any as ExecutionContext, callHandler as CallHandler)
      .pipe(take(1))
      .subscribe({
        error: error => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(error).toBeInstanceOf(BadRequestException);

          done();
        },
      });
  });
});
