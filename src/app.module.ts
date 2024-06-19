import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import {
  GlobalValidationPipeProvider,
  LogRequestInterceptorProvider,
} from './common/providers';
import { AppConfigModule } from './imports';

@Module({
  imports: [AppConfigModule.forRoot(), CommonModule],
  providers: [LogRequestInterceptorProvider, GlobalValidationPipeProvider],
})
export class AppModule {}
