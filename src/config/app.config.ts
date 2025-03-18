import { Expose, Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsPort, IsSemVer } from 'class-validator';

import { Environments } from '../application/constants';
import { Environment } from '../application/types';
import { EnvSchemaLoader } from '../application/utils';

function setEnvironment(envVar: any): Environment {
  const regExp = new RegExp(`^${envVar}$`, 'i');
  const matchedEnv = Environments.find((env) => regExp.test(env));

  return matchedEnv || 'DEVELOPMENT';
}

export class AppConfig {
  @Expose({ name: 'NODE_ENV' })
  @Transform(({ value }) => setEnvironment(value))
  @IsIn(Environments)
  readonly environment: Environment;

  @Expose({ name: 'APP_PORT' })
  @Transform(({ value }) => (value || '3000') as `${number}`)
  @IsNotEmpty()
  @IsPort()
  readonly port: `${number}`;

  @Expose({ name: 'npm_package_name' })
  @IsNotEmpty()
  readonly name: string;

  @Expose({ name: 'npm_package_version' })
  @IsNotEmpty()
  @IsSemVer()
  readonly version: string;
}

export const appConfig = EnvSchemaLoader.validate(AppConfig);
