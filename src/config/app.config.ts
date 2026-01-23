import { LOG_LEVELS, type LogLevel } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TruthyExpression = /^(true|1|yes|on)$/i;
const LogLevelSchema = z.enum([...LOG_LEVELS] as [LogLevel, ...LogLevel[]]);

export class AppConfig extends createZodDto(
  z
    .object({
      APP_PORT: z.coerce.number().int().min(0).max(65535),
      APP_HOSTNAME: z
        .string()
        .optional()
        .transform((value) => (value ? value : '0.0.0.0')),
      APP_ENV: z
        .string()
        .optional()
        .transform((value) => (value ? value : 'local')),
      APP_LOG_LEVELS: z
        .string()
        .optional()
        .transform((value) => {
          return !value
            ? LOG_LEVELS
            : value
                .split(',')
                .map((level) => level.trim())
                .filter((level) => level.length > 0);
        })
        .pipe(z.array(LogLevelSchema)),
      APP_ENABLE_CORS: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
      APP_ENABLE_HELMET: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
      APP_ENABLE_COMPRESSION: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
      APP_ENABLE_SWAGGER: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
      npm_package_name: z.string().min(1),
      npm_package_version: z.string().min(1),
    })
    .transform((value) => ({
      port: value.APP_PORT,
      hostname: value.APP_HOSTNAME,
      environmentLabel: value.APP_ENV,
      logLevels: value.APP_LOG_LEVELS,
      enableCors: value.APP_ENABLE_CORS,
      enableHelmet: value.APP_ENABLE_HELMET,
      enableCompression: value.APP_ENABLE_COMPRESSION,
      enableSwagger: value.APP_ENABLE_SWAGGER,
      name: value.npm_package_name,
      version: value.npm_package_version,
    })),
) {}
