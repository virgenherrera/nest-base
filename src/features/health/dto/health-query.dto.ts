import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { TruthyExpression } from '../../../core/utils';

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
        'Set to true to include a human-readable service uptime duration in the health response.',
      ),
  }),
) {}
