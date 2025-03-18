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
      transform: true,
      transformOptions: {
        excludeExtraneousValues: false,
        enableImplicitConversion: true,
      },
    }),
};

export const PagedResultsInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: PagedResultsInterceptor,
};
