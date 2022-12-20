export interface SoftBatchCreated<T> {
  successes: Record<number, T>;
  errors: Record<number, string>;
}
