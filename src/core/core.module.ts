import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { createZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';

import { AppConfig, ServerConfig, SwaggerConfig } from '../config';
import { AppConfigModule } from './config/app-config.module';
import { HttpErrorFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    AppConfigModule.forRoot({
      cache: false,
      configClasses: [AppConfig, ServerConfig, SwaggerConfig],
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
export class CoreModule {}
