import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

import { Logger } from '../../common/decorators';
import { BadRequestDto, InternalServerErrorDto, NotFoundDto } from '../dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  static getDocs(badRequest = true, notFound = true, internal = true) {
    const res = [UseFilters(HttpExceptionFilter)];

    if (badRequest) res.push(ApiBadRequestResponse({ type: BadRequestDto }));
    if (notFound) res.push(ApiNotFoundResponse({ type: NotFoundDto }));
    if (internal)
      res.push(
        ApiInternalServerErrorResponse({ type: InternalServerErrorDto }),
      );

    return res;
  }

  @Logger() private readonly logger: Logger;

  readonly exceptionMap = {
    [HttpStatus.BAD_REQUEST]: (details: Array<HttpException['message']>) =>
      plainToInstance(BadRequestDto, { details }),
    [HttpStatus.NOT_FOUND]: (details: Array<HttpException['message']>) =>
      plainToInstance(NotFoundDto, { details }),
    [HttpStatus.INTERNAL_SERVER_ERROR]: (
      details: Array<HttpException['message']>,
    ) => plainToInstance(InternalServerErrorDto, { details }),
  } as const;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = (exception.getStatus() ??
      HttpStatus.INTERNAL_SERVER_ERROR) as keyof typeof this.exceptionMap;
    const factory = this.exceptionMap[status] ?? this.exceptionMap[500];
    const details = this.getDetails(exception);
    const errorDto = factory(details);

    if (errorDto.statusCode >= 500 && exception.stack)
      this.logger.debug(
        exception.stack
          .split('\n')
          .filter((ln) => !ln.includes('node_modules'))
          .join('\n'),
      );

    response.status(errorDto.statusCode).json(errorDto);
  }

  getDetails(exception: HttpException): string[] {
    const response = exception.getResponse();
    const res: string[] = [];

    if (typeof response === 'string') return res.concat(response);
    else if ('message' in response && typeof response.message === 'string')
      return res.concat(response.message);
    else if ('message' in response && Array.isArray(response.message))
      return res.concat(response.message).flat();

    return res;
  }
}
