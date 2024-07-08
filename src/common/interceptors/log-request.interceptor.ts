import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { hrtime } from 'node:process';
import { Observable, catchError, tap } from 'rxjs';

import { Logger } from '../decorators';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  @Logger() private readonly logger: Logger;

  private get timeStamp(): bigint {
    return hrtime.bigint();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { timeStamp: startAt } = this;
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const { method, originalUrl } = request;
        const { statusCode } = response;
        const diff = this.timeStamp - startAt;
        const responseTime = Number(diff / BigInt(1e6));
        const message = `${method} ${originalUrl}; HTTP Status ${statusCode}; ${responseTime}ms`;

        this.logger.log(message);
      }),
      catchError(error => {
        if (!(error instanceof HttpException)) {
          this.logger.error(error);

          throw error;
        }

        const statusCode = error.getStatus();
        const response = error.getResponse();
        const bar =
          typeof response === 'string'
            ? response
            : 'response:\n' + JSON.stringify(response, null, 2);

        const methodName: 'error' | 'warn' =
          statusCode >= 500 ? 'error' : 'warn';
        const diff = this.timeStamp - startAt;
        const responseTime = Number(diff / BigInt(1e6));
        const { method, originalUrl } = request;
        const message = `${method} ${originalUrl}; HTTP Status ${statusCode}; ${bar};${responseTime}ms`;

        this.logger[methodName](message);

        throw error;
      }),
    );
  }
}
