import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { TruthyExpression } from '../core/utils';

export class SwaggerConfig extends createZodDto(
  z
    .object({
      SWAGGER_ENABLED: z.coerce
        .string()
        .optional()
        .transform((value) => TruthyExpression.test(`${value}`)),
    })
    .transform((value) => ({
      enabled: value.SWAGGER_ENABLED,
    })),
) {}
