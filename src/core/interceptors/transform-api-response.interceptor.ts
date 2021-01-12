import { ApiResponse, ApiResponseType, NumerableApiResponse } from '@core/dto';
import { Numerable } from '@core/dto/numerable.dto';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformApiResponse implements NestInterceptor<ApiResponseType> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const { statusCode } = context.switchToHttp().getResponse();

    return next.handle().pipe(map(this.mapResponse.bind(this, statusCode)));
  }

  mapResponse(statusCode: number, responseData: any) {
    return responseData instanceof Numerable
      ? new NumerableApiResponse(
          statusCode,
          responseData.data,
          responseData.paging,
        )
      : new ApiResponse(statusCode, responseData);
  }
}
