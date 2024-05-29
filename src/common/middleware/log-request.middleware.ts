import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { hrtime } from 'node:process';

import { Logger } from '../decorators';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  @Logger() private logger: Logger;

  use(request: Request, response: Response, next: NextFunction) {
    const startAt = hrtime.bigint();

    response.on(
      'finish',
      this.logRequest.bind(this, request, response, startAt),
    );

    next();
  }

  private logRequest(request: Request, response: Response, startAt: bigint) {
    const { method, originalUrl } = request;
    const { statusCode } = response;
    const userAgent = request.get('user-agent') || 'unidentified';
    const contentLength = response.get('content-length') || '0';
    const diff = hrtime.bigint() - startAt;
    const responseTime = Number(diff / BigInt(1e6));
    const message = `(${userAgent})|${method};${originalUrl}|${statusCode}|${contentLength} bytes|${responseTime}ms`;

    this.logger.log(message);
  }
}
