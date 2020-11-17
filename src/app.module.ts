import { rootConfigModule } from '@core/config';
import { TYPEORM_CONFIG } from '@core/tokens';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfigModule),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get(TYPEORM_CONFIG),
    }),
    UserModule,
  ],
})
export class AppModule {}
