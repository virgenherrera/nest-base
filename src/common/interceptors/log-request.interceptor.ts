import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { hrtime } from 'node:process';
import { Observable, catchError, tap } from 'rxjs';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

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
        const logMessage = [
          method,
          originalUrl,
          statusCode,
          `${responseTime}ms`,
        ].join(' | ');

        this.logger.log(logMessage);
      }),
      catchError(error => {
        const diff = this.timeStamp - startAt;
        const responseTime = Number(diff / BigInt(1e6));
        const { method, originalUrl, headers, body } = request;
        const isHttpException = error instanceof HttpException;
        const statusCode = isHttpException ? error.getStatus() : 500;
        const isInternalError = statusCode >= 500;
        const response = isHttpException ? error.getResponse() : error.message;
        const methodName = isInternalError ? 'error' : 'warn';
        const msgSegments = [
          methodName,
          method,
          originalUrl,
          statusCode,
          `${responseTime}ms`,
        ];

        if (isInternalError)
          msgSegments.push(
            response,
            error.stack,
            JSON.stringify(headers),
            JSON.stringify(body),
          );

        const logMessage = msgSegments.join(' | ');

        this.logger[methodName](logMessage);
        throw error;
      }),
    );
  }
}
