import "reflect-metadata";

type Constructor = { new(...args: any[]): any };

export interface Type<T> {
  new(...args: any[]): T;
}

export interface IDecoratorRegistration {
  type: Constructor
  dependencies: Constructor[]
}

export var registrations: IDecoratorRegistration[] = [];

export function containerService() {
  return function containerService<T extends Constructor>(BaseClass: T): T | void {
    var deps = <Constructor[]>Reflect.getMetadata("design:paramtypes", BaseClass);
    registrations.push({ type: BaseClass, dependencies: deps ?? [] });
    return BaseClass;
  }
}
