import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = (
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    ) as HttpStatus;
    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message = this.normalizeMessage(responseBody);
    const errorLabel = this.resolveErrorLabel(status, responseBody);

    const payload: Record<string, unknown> = {
      statusCode: status,
      error: errorLabel,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    const requestId = request.headers['x-request-id'];
    if (requestId) {
      payload.requestId = requestId;
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const err =
        exception instanceof Error
          ? exception
          : new Error(
              typeof exception === 'string' ? exception : 'Unknown error',
            );
      this.logger.error('Unhandled exception', err.stack);
    } else {
      this.logger.warn(`Request failed with status ${status}`);
    }

    response.status(status).json(payload);
  }

  private normalizeMessage(responseBody: unknown): string[] {
    if (typeof responseBody === 'string') {
      return [responseBody];
    }

    if (responseBody && typeof responseBody === 'object') {
      const body = responseBody as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        return body.message;
      }
      if (typeof body.message === 'string') {
        return [body.message];
      }
    }

    return ['Unexpected error'];
  }

  private resolveErrorLabel(status: number, responseBody: unknown): string {
    if (responseBody && typeof responseBody === 'object') {
      const body = responseBody as { error?: string };
      if (body.error) {
        return body.error;
      }
    }

    return HttpStatus[status] ?? 'Error';
  }
}
