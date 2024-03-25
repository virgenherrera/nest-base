import { applyDecorators, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommonRoute } from '../enums';
import { SystemHealth } from '../models';

export function GetHealthDocs() {
  return applyDecorators(
    Get(CommonRoute.health),
    ApiOperation({
      summary: `GET ${CommonRoute.health}`,
      description: 'Get Service Health.',
    }),
    ApiResponse({
      type: SystemHealth,
      status: 200,
      description: `${SystemHealth.name} instance containing data about current running service.`,
    }),
  );
}
