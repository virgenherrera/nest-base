import { Module } from '@nestjs/common';

import { HealthController } from './app/controllers';
import { AppConfigModule } from './app/imports';
import { AppFilter, AppInterceptor, AppPipe } from './app/providers';

@Module({
  controllers: [HealthController],
  imports: [AppConfigModule],
  providers: [AppPipe, AppInterceptor, AppFilter],
})
export class AppModule {}
