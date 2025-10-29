import { ClassProvider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { HttpExceptionFilter } from '../filters';

export const AppPipe: ClassProvider = {
  provide: APP_PIPE,
  useClass: ZodValidationPipe,
};

export const AppInterceptor: ClassProvider = {
  provide: APP_INTERCEPTOR,
  useClass: ZodSerializerInterceptor,
};

export const AppFilter: ClassProvider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
