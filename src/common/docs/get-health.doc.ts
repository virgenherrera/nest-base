import { applyDecorators, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

export function GetHealthDocs() {
  return applyDecorators(
    Get(),
    HealthCheck(),
    ApiOperation({
      summary: 'Perform a health check of the service',
      description: 'Checks the health of the service status report.',
    }),
  );
}
