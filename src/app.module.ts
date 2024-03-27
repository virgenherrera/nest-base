import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { LogRequestMiddleware } from './common/middleware';
import { AppConfigModule } from './imports';

@Module({
  imports: [AppConfigModule.forRoot(), CommonModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('*');
  }
}
