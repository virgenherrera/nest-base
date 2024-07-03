import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import {
  GlobalValidationPipeProvider,
  LogRequestInterceptorProvider,
} from './common/providers';

@Module({
  imports: [CommonModule],
  providers: [GlobalValidationPipeProvider, LogRequestInterceptorProvider],
})
export class AppModule {}
