import { Numerable } from './numerable.dto';
import { Paging } from './paging.dto';

export type ApiResponseType = ApiResponse | NumerableApiResponse;

export class ApiResponse<T = any> {
  success = true;

  constructor(public statusCode: number, public data: T) {}
}

export class NumerableApiResponse<T = any> extends Numerable {
  success = true;

  constructor(public statusCode: number, data: T[], paging: Paging) {
    super(data, paging);
  }
}
