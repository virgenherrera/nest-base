import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from 'joi';
import { join } from 'path';
import { appConfig } from './app.config';
import { typeOrmConfig } from './typeorm.config';

export const rootConfigModule: ConfigModuleOptions = {
  isGlobal: true,
  load: [appConfig, typeOrmConfig],
  envFilePath: join(__dirname, '../../../.env'),
  validationSchema: Joi.object({
    // # APP
    APP_PORT: Joi.number().port().required(),
    APP_USE_DOCS: Joi.boolean().default(false).required(),

    // # Database connection
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().port().required(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
  }),
};
