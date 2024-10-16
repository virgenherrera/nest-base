import { Module } from '@nestjs/common';

import { HealthController } from './application/controllers';
import { AppConfigModule } from './application/imports';
import {
  GlobalValidationPipeProvider,
  LogRequestInterceptorProvider,
  PagedResultsInterceptorProvider,
} from './application/providers';

@Module({
  imports: [AppConfigModule.forRoot()],
  providers: [
    GlobalValidationPipeProvider,
    LogRequestInterceptorProvider,
    PagedResultsInterceptorProvider,
  ],
  controllers: [HealthController],
})
export class AppModule {}
