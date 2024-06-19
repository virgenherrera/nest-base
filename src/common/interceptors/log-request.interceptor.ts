import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { hrtime } from 'node:process';
import { Observable, tap } from 'rxjs';

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

        this.logMessage(statusCode, message);
      }),
    );
  }

  private logMessage(statusCode: number, message: string): void {
    if (statusCode >= 500) {
      this.logger.error(message);
    } else if (statusCode >= 400) {
      this.logger.warn(message);
    } else {
      this.logger.log(message);
    }
  }
}
