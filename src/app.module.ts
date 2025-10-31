import { Module } from '@nestjs/common';

import { HealthController } from './app/controllers';
import { AppConfigModule } from './app/imports';
import { GlobalValidationPipeProvider } from './app/providers';

@Module({
  controllers: [HealthController],
  imports: [AppConfigModule],
  providers: [GlobalValidationPipeProvider],
})
export class AppModule {}
