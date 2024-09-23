import { Expose, Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsPort } from 'class-validator';

import { Environments } from '../common/constants';
import { Environment } from '../common/types';
import { EnvSchemaLoader } from '../utils/env-schema-loader.util';

function setEnvironment(envVar: string): Environment {
  const regex = new RegExp(`^${envVar}$`, 'i');
  const matchedEnv = Environments.find(env => regex.test(env));

  return matchedEnv || 'DEVELOPMENT';
}

export class AppConfig {
  @Expose({ name: 'NODE_ENV' })
  @Transform(({ value }) => setEnvironment(value))
  @IsIn(Environments)
  readonly environment: Environment;

  @Expose({ name: 'APP_PORT' })
  @Transform(({ value }) => value || '3000')
  @IsNotEmpty()
  @IsPort()
  readonly port: `${number}`;
}

export const appConfig = EnvSchemaLoader.validate(AppConfig);
