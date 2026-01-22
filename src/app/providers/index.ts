import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export const GlobalValidationPipeProvider: Provider = {
  provide: APP_PIPE,
  useFactory: () =>
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      },
      validationError: {
        target: false,
        value: false,
      },
      whitelist: true,
    }),
};
