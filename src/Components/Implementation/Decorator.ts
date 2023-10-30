import { Constructor } from "../../Utils/Type";

export interface IComponentRoute {
  path: string;
  name?: string;
}
export interface IComponentRegistration {

  /**
   * Only specified for components.
   */
  tagName?: string;
  
  className: string;

  /**
   * Only specified for pages
   */
  route?: IComponentRoute;
  componentConstructor: Constructor;
}

export var registrations: IComponentRegistration[] = [];

export function component(tagName: string) {
  return function component<T extends Constructor>(BaseClass: T): T | void {
    var registration: IComponentRegistration = {
      componentConstructor: BaseClass,
      className: BaseClass.name,
      tagName
    };
    registrations.push(registration)

    return BaseClass;
  }
}

export function page(routePath: string) {
  return function page<T extends Constructor>(BaseClass: T): T | void {
    var registration: IComponentRegistration = {
      componentConstructor: BaseClass,
      className: BaseClass.name,
    };
    if (routePath) {
      registration.route = {
        path: routePath
      };

    }
    registrations.push(registration)

    return BaseClass;
  }
}