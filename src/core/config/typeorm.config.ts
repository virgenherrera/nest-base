import { Environment } from '@core/enums';
import { TYPEORM_CONFIG } from '@core/tokens';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { LoggerOptions } from 'typeorm';

export const typeOrmConfig = registerAs(TYPEORM_CONFIG, () => {
  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
  } = process.env;

  const logging: LoggerOptions = ['warn', 'error'];

  if (process.env.NODE_ENV !== Environment.production)
    logging.push('query', 'schema', 'info', 'log', 'migration');

  const options: TypeOrmModuleOptions = {
    type: 'mongodb',
    logging: ['warn', 'error'],
    useUnifiedTopology: true,
    authSource: 'admin',
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT, 10),
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [join(__dirname, '../../entities/*.entity.js')],
    autoLoadEntities: true,
  };

  Object.seal(options);
  Object.freeze(options);

  return options;
});
