import { Expose, Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Environments } from '../app/constants';
import type { Environment } from '../app/types';

export class AppConfig {
  @Expose({ name: 'APP_PORT' })
  @Transform(({ value }) => {
    const num = Number(value);

    return isNaN(num) ? 3000 : Math.min(Math.max(num, 0), 65535);
  })
  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number = 3000;

  @Expose({ name: 'HOSTNAME' })
  @Transform(({ value }) => (value as string) || '0.0.0.0')
  @IsString()
  @IsNotEmpty()
  hostname: string = '0.0.0.0';

  @Expose({ name: 'NODE_ENV' })
  @IsIn(Environments)
  environment: Environment;

  @Expose({ name: 'npm_package_name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose({ name: 'npm_package_version' })
  @IsString()
  @IsNotEmpty()
  version: string;
}
