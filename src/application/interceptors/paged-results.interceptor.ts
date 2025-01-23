import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, switchMap } from 'rxjs';

import { PagedResults } from '../dto';

@Injectable()
export class PagedResultsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, path } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      switchMap((data) => {
        return method === 'GET' && data instanceof PagedResults
          ? this.addPrefixToPagedResults(path, data)
          : of(data);
      }),
    );
  }

  private addPrefixToPagedResults<T extends PagedResults<any>>(
    path: string,
    response: T,
  ): Observable<T> {
    this.logger.log(`Prefixing req.path to 'prev' and 'next' props`);

    if (response.pagination.prev)
      response.pagination.prev = `${path}${response.pagination.prev}`;

    if (response.pagination.next)
      response.pagination.next = `${path}${response.pagination.next}`;

    this.logger.verbose(`prefix: ${path} added to pagination links`);

    return of(response);
  }
}
