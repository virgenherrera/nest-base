import { applyDecorators, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

export function GetHealthDocs() {
  return applyDecorators(
    Get(),
    HealthCheck(),
    ApiOperation({
      summary: 'Perform a health check of the service',
      description:
        'Checks the health of the service, including uptime, CPU usage, and memory heap status, and returns a detailed status report.',
    }),
    ApiResponse({
      status: 200,
      description: 'The health status of the service',
      schema: {
        example: {
          status: 'ok',
          info: {
            uptime: {
              status: 'up',
              uptime: '8 seconds',
            },
            cpu: {
              status: 'up',
              cpu: '0.88%',
            },
            memory_heap: {
              status: 'up',
            },
          },
          error: {},
          details: {
            uptime: {
              status: 'up',
              uptime: '8 seconds',
            },
            cpu: {
              status: 'up',
              cpu: '0.88%',
            },
            memory_heap: {
              status: 'up',
            },
          },
        },
      },
    }),
  );
}
