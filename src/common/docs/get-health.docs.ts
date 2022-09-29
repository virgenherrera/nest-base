import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SystemHealth } from '../models';

export function GetHealthDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Service Health.' }),
    ApiResponse({
      type: SystemHealth,
      status: 200,
      description: `${SystemHealth.name} instance containing data about current running service.`,
    }),
  );
}
