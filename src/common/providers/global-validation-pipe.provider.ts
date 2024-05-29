import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export class GlobalValidationPipe extends ValidationPipe {
  static readonly Provider: Provider = {
    provide: APP_PIPE,
    useClass: GlobalValidationPipe,
  };

  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }
}
