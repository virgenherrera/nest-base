import { LOG_LEVELS, type LogLevel } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const TruthyExpression = /^(true|1|yes|on)$/i;
export const getBoolean = (obj: unknown, key: string): boolean => {
  const raw = (obj as Record<string, string>)[key];

  return TruthyExpression.test(`${raw}`);
};

export class AppConfig {
  @Expose({ name: 'APP_PORT' })
  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number;

  @Expose({ name: 'APP_HOSTNAME' })
  @Transform(({ value }) => (!value ? '0.0.0.0' : `${value}`))
  @IsString()
  @IsNotEmpty()
  hostname: string;

  @Expose({ name: 'APP_ENV' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  environmentLabel: string = 'local';

  @Expose({ name: 'APP_LOG_LEVELS' })
  @Transform(({ value }) => (!value ? LOG_LEVELS : `${value}`.split(',')))
  @IsArray()
  @IsIn(LOG_LEVELS, { each: true })
  logLevels: LogLevel[];

  @Expose({ name: 'APP_ENABLE_CORS' })
  @Transform(({ obj }) => getBoolean(obj, 'APP_ENABLE_CORS'))
  @IsBoolean()
  enableCors: boolean;

  @Expose({ name: 'APP_ENABLE_HELMET' })
  @Transform(({ obj }) => getBoolean(obj, 'APP_ENABLE_HELMET'))
  @IsBoolean()
  enableHelmet: boolean;

  @Expose({ name: 'APP_ENABLE_COMPRESSION' })
  @Transform(({ obj }) => getBoolean(obj, 'APP_ENABLE_COMPRESSION'))
  @IsBoolean()
  enableCompression: boolean;

  @Expose({ name: 'APP_ENABLE_SWAGGER' })
  @Transform(({ obj }) => getBoolean(obj, 'APP_ENABLE_SWAGGER'))
  @IsBoolean()
  enableSwagger: boolean;

  @Expose({ name: 'npm_package_name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose({ name: 'npm_package_version' })
  @IsString()
  @IsNotEmpty()
  version: string;
}
