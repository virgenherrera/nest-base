import { Logger, Module } from '@nestjs/common';

import { HealthController } from './application/controllers';
import { AppConfigModule } from './application/imports';
import {
  GlobalValidationPipeProvider,
  PagedResultsInterceptorProvider,
} from './application/providers';

@Module({
  imports: [AppConfigModule.forRoot],
  controllers: [HealthController],
  providers: [
    GlobalValidationPipeProvider,
    PagedResultsInterceptorProvider,
    Logger,
  ],
})
export class AppModule {}
