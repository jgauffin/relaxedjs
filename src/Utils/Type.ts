export type Constructor = { new(...args: any[]): any };

export interface Type<T> {
  new(...args: any[]): T;
}
