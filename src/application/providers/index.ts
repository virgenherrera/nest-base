import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import {
  LogRequestInterceptor,
  PagedResultsInterceptor,
} from '../interceptors';

export const GlobalValidationPipeProvider: Provider = {
  provide: APP_PIPE,
  useFactory: () =>
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        excludeExtraneousValues: false,
      },
    }),
};

export const LogRequestInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: LogRequestInterceptor,
};

export const PagedResultsInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: PagedResultsInterceptor,
};
