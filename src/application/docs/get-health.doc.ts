import { applyDecorators, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetHealthResponseDto } from '../dto';

export function GetHealthDocs() {
  return applyDecorators(
    Get(),
    ApiOperation({
      summary: 'Perform a health check of the service',
      description: 'Checks the health of the service status report.',
    }),
    ApiOkResponse({ type: GetHealthResponseDto }),
  );
}
