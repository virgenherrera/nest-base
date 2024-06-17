import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export class GlobalValidationPipe extends ValidationPipe {
  static readonly provider: Provider = {
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
