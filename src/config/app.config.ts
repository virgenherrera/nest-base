import { Expose, Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsPort } from 'class-validator';

import { EnvSchemaLoader } from '../utils/env-schema-loader.util';

export type Environment = (typeof AppConfig.AvailableEnvironments)[number];

export class AppConfig {
  static readonly AvailableEnvironments = [
    'DEVELOPMENT',
    'TEST',
    'E2E',
    'QA',
    'UAT',
    'PROD',
  ] as const;

  @Expose({ name: 'NODE_ENV' })
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(AppConfig.AvailableEnvironments)
  readonly environment: Environment;

  @Expose({ name: 'APP_PORT' })
  @Transform(({ value }) => value || '3000')
  @IsNotEmpty()
  @IsPort()
  readonly port: `${number}`;
}

export const appConfig = EnvSchemaLoader.validate(AppConfig);
