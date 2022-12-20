import { Paging } from './paging.interface';

export interface FoundAndCounted<T> {
  data: T[];
  paging: Paging;
}
