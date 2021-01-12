import { Paging } from './paging.dto';

export class Numerable<T = any> {
  constructor(public data: T[], public paging: Paging) {}
}
