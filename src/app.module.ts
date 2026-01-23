import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { createZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';

import { AppConfigModule } from './app/imports';
import { HealthController } from './app/controllers';
import { HttpErrorFilter } from './app/filters/http-exception.filter';
import { AppConfig } from './config';

@Module({
  controllers: [HealthController],
  imports: [
    AppConfigModule.forRoot({
      cache: false,
      configClasses: [AppConfig],
      expandVariables: true,
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: createZodValidationPipe({ strictSchemaDeclaration: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
