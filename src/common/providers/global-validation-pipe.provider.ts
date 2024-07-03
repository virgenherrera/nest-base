import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

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
