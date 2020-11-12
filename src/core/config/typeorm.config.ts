import { Environment } from '@core/enums';
import { TYPEORM_CONFIG } from '@core/tokens';
import { ConfigService, registerAs } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { join } from 'path';
import { LoggerOptions } from 'typeorm';

export function typeormConfigFactory(): TypeOrmModuleOptions {
  const logging: LoggerOptions = ['warn', 'error'];

  if (process.env.NODE_ENV !== Environment.production)
    logging.push('query', 'schema', 'info', 'log', 'migration');

  return {
    type: 'mongodb',
    useNewUrlParser: true,
    host: 'localhost',
    authSource: 'admin',
    port: 27017,
    username: 'root',
    password: 'root',
    database: 'test',
    logging,
    entities: [join(__dirname, '../../entities/*.entity{.ts,.js}')],
    autoLoadEntities: true,
  };
}

export const typeOrmConfig = registerAs(TYPEORM_CONFIG, typeormConfigFactory);

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    configService.get<TypeOrmModuleOptions>(TYPEORM_CONFIG),
};
