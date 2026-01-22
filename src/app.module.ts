import { Module } from '@nestjs/common';

import { AppConfigModule } from './app/imports';
import { HealthController } from './app/controllers';
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
  providers: [GlobalValidationPipeProvider],
})
export class AppModule {}
