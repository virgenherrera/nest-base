import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TruthyExpression = /^(true|1|yes|on)$/i;

export class HealthQueryDto extends createZodDto(
  z.object({
    appMeta: z.coerce
      .string()
      .optional()
      .transform((value) =>
        value === undefined ? undefined : TruthyExpression.test(value),
      )
      .describe(
        'Set to true to include application metadata (package name and version from package.json) in the health response.',
      ),
    uptime: z.coerce
      .string()
      .optional()
      .transform((value) =>
        value === undefined ? undefined : TruthyExpression.test(value),
      )
      .describe(
        'Set to true to include service uptime information (in seconds) in the health response.',
      ),
  }),
) {}
