import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { PagedResultsInterceptor } from '../interceptors';

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

export const PagedResultsInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: PagedResultsInterceptor,
};