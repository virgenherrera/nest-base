import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../decorators';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  @Logger() private logger: Logger;

  use(request: Request, response: Response, next: NextFunction) {
    response.on(
      'finish',
      this.logRequest.bind(this, request, response, process.hrtime()),
    );

    next();
  }

  private logRequest(
    request: Request,
    response: Response,
    startAt: [number, number],
  ) {
    const { method, originalUrl } = request;
    const { statusCode } = response;
    const userAgent = request.get('user-agent') || 'unidentified';
    const contentLength = response.get('content-length');
    const diff = process.hrtime(startAt);
    const responseTime = diff[0] * 1e3 + diff[1] / 1e6;
    const message = `(${userAgent}) ${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTime}ms`;

    this.logger.log(message);
  }
}
