import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { TruthyExpression } from '../core/utils';

export class ServerConfig extends createZodDto(
  z
    .object({
      SERVER_PORT: z.coerce.number().int().min(0).max(65535),
      SERVER_HOSTNAME: z
        .string()
        .optional()
        .transform((value) => (value ? value : '0.0.0.0')),
      SERVER_ENABLE_CORS: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
      SERVER_ENABLE_HELMET: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
      SERVER_ENABLE_COMPRESSION: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
    })
    .transform((value) => ({
      port: value.SERVER_PORT,
      hostname: value.SERVER_HOSTNAME,
      enableCors: value.SERVER_ENABLE_CORS,
      enableHelmet: value.SERVER_ENABLE_HELMET,
      enableCompression: value.SERVER_ENABLE_COMPRESSION,
    })),
) {}
