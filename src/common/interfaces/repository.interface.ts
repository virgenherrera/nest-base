import { FoundAndCounted } from './found-and-counted.interface';

export interface IBatchCreate<T, U> {
  batchCreate(dtos: T[]): Promise<U>;
}

export interface ICreate<T, U> {
  create(dtos: T): Promise<U>;
}

export interface IDelete<T> {
  delete(id: string): Promise<T>;
}

export interface IFind<T, U> {
  find(dto: T): Promise<U[]>;
}

export interface IFindAndCount<T, U> {
  findAndCount(dto: T): Promise<FoundAndCounted<U>>;
}

export interface IFindById<T> {
  findById(id: string): Promise<T>;
}

export interface IFindOne<T, U> {
  findOne(dto: T): Promise<U>;
}

export interface IUpdate<T, U> {
  update(id: string, dto: T): Promise<U>;
}
