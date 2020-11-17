import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { join } from 'path';
import { appConfig } from './app.config';
import { typeOrmConfig } from './typeorm.config';

export const rootConfigModule: ConfigModuleOptions = {
  isGlobal: true,
  load: [appConfig, typeOrmConfig],
  envFilePath: join(__dirname, '../../../.env'),
};
