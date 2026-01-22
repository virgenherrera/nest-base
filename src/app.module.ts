import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppConfigModule } from './app/imports';
import { HealthController } from './app/controllers';
import { HttpErrorFilter } from './app/filters/http-exception.filter';
import { GlobalValidationPipeProvider } from './app/providers';
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
    GlobalValidationPipeProvider,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
