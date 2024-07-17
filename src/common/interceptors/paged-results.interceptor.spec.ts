import { CallHandler, ExecutionContext, RequestMethod } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, take } from 'rxjs';

import { PagedResults } from '../dto';
import { PagedResultsInterceptor } from './paged-results.interceptor';

describe(`UT:${PagedResultsInterceptor.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    addPathPrefix = 'Should add req.path when HTTP Verb is GET and response is instance of PagedResults',
    doNothingOnDefault = 'Should do nothing on otherwise.',
  }
  let interceptor: PagedResultsInterceptor = null;
  const getMockExecutionContext = (
    method: keyof typeof RequestMethod,
    path: string,
  ) => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        method,
        path,
      }),
    }),
  });
  const getMockCallHandler = (expectedValue: any = {}) => ({
    handle: jest.fn().mockReturnValue(of(expectedValue)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagedResultsInterceptor],
    }).compile();

    interceptor = module.get(PagedResultsInterceptor);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetAllMocks;
  });

  it(should.init, async () => {
    expect(interceptor).not.toBeNull();
    expect(interceptor).toBeInstanceOf(PagedResultsInterceptor);
  });

  it(should.addPathPrefix, done => {
    const pagedResults = new PagedResults();

    pagedResults.rows = [];
    pagedResults.pagination = { prev: '?foo=bar', next: '?foo=bar' } as any;

    const mockExecutionContext = getMockExecutionContext(
      'GET',
      '/api/fake-path',
    ) as any as ExecutionContext;
    const mockCallHandler = getMockCallHandler(pagedResults) as CallHandler;
    const interceptSpy = jest.spyOn(interceptor, 'intercept');

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(take(1))
      .subscribe({
        next: () => {
          expect(interceptSpy).toHaveBeenCalledTimes(1);
          done();
        },
        error: error => done(error),
      });
  });

  it(should.doNothingOnDefault, done => {
    const expectedData = { foo: '?foo=bar', bar: '?foo=bar' } as any;

    const mockExecutionContext = getMockExecutionContext(
      'PATCH',
      '/api/fake-path',
    ) as any as ExecutionContext;
    const mockCallHandler = getMockCallHandler(expectedData) as CallHandler;
    const interceptSpy = jest.spyOn(interceptor, 'intercept');

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(take(1))
      .subscribe({
        next: data => {
          expect(data).toBe(expectedData);
          expect(interceptSpy).toHaveBeenCalledTimes(1);
          done();
        },
        error: error => done(error),
      });
  });
});
