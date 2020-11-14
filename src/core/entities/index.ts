export interface NestValueProvider<T = any> {
  provide: string;
  useValue: T;
}
