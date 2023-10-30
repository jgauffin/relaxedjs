import "reflect-metadata";

export interface Type<T> {
    new(...args: any[]): T;
}


export interface IServiceLocator {
    resolve(key: string | any): any;
    //resolve<T>(): T;
}

interface IServiceRegistry {
    register(service: string | any, instance?: any): void;
}

export interface IContainerScope extends IServiceLocator{
    release(): void;
}

export interface IContainer extends IServiceRegistry, IServiceLocator{
    createScope(): IContainerScope;
}

interface IService {
    key: string;
    scope: string;
    dependencyTypes: any[];
    type: any;
}

let InternalInstance: IContainer;

export class Container implements IContainer, IServiceRegistry {
    private registry: Map<string, IService> = new Map();
    private instances: Map<string, any> = new Map();
    private _useRootContainer: boolean = false;


    public get useRootContainer(): boolean {
        return this._useRootContainer;
    }
    public set useRootContainer(v: boolean) {
        this._useRootContainer = v;
    }

    createScope(): IContainerScope {
        return new ContainerScope(this.registry, this);
    }

    register(service: string | any, instance?: any) {

        let key = "";
        if (typeof service == "function") {
            var type = this.getBaseClass(service);
            key = type.name.toLowerCase();
        }
        else {
            key = service.toLowerCase();
        }

        var dependencies: any[] = [];
        if (typeof service !== "string") {
            var paramTypes = Reflect.getMetadata('design:paramtypes', service);
            if (!paramTypes) {
                paramTypes = Reflect.getMetadata('design:paramtypes', service.prototype);
            }

            if (paramTypes) {
                paramTypes.forEach((element: any) => {
                    dependencies.push(element);
                });

            } else {
                // Registered without metadata. 
                // Let's try to parse the argument names
                // and use those as keys.
                const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                const ARGUMENT_NAMES = /([^\s,]+)/g;
                var fnStr = service.toString().replace(STRIP_COMMENTS, '');
                var result: string[] = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
                if (result) {
                    result.forEach(x => {
                        dependencies.push(x);
                    });
                }
            }

        }

        var serviceObj: IService = {
            key: key,
            scope: "global",
            dependencyTypes: dependencies,
            type: service
        };


        if (instance) {
            this.instances.set(key, instance);
        }

        if (!this.registry.has(key)) {
            this.registry.set(key, serviceObj);
        }
    }

    resolve(key: string | any) {

        if (typeof key !== "string") {
            var type = this.getBaseClass(key);
            key = type.name.toLowerCase();
        } else {
            key = key.toLowerCase();
        }

        var instance = this.instances.get(key);
        if (typeof instance !== "undefined") {
            return instance;
        }

        var service = <IService>this.registry.get(key);
        if (typeof service === "undefined") {
            if (this._useRootContainer) {
                service = <IService>InternalInstance.resolve(key);
            }

            if (typeof service === "undefined") {
                throw new Error(`Service with key '${key}' has not been registered.`);
            }
        }

        //const tokens = Reflect.getMetadata("design:paramtypes", service.type) || [];

        // const injections = tokens.map((token: Type<any>): any =>
        // Injector.resolve(token)
        // );

        var dependencies: any[] = [];
        service.dependencyTypes.forEach(dependency => {
            var dep = this.resolve(dependency);
            dependencies.push(dep);
        });

        instance = new service.type(...dependencies);
        this.instances.set(service.key, instance);
        return instance;
    }

    private getBaseClass(targetClass: any) {
        if (targetClass instanceof Function) {
            let baseClass = targetClass;

            while (baseClass) {
                const newBaseClass = Object.getPrototypeOf(baseClass);
                if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
                    baseClass = newBaseClass;
                } else {
                    break;
                }
            }

            return baseClass;
        }
    }
}

var temp = new Container();
temp.useRootContainer = false;
InternalInstance = temp;

export class ContainerScope implements IContainerScope {
    private instances: Map<string, any> = new Map();

    constructor(private services: Map<string, IService>, private parentLocator: IServiceLocator) {
    }
    release(): void {
        
    }

    resolve(key: string | any): any {
        if (typeof key !== "string") {
            console.log('not a string', key);
            key = key.name;
        }

        var instance = this.instances.get(key);
        if (typeof instance !== "undefined") {
            return instance;
        }

        var service = <IService>this.services.get(key);
        if (typeof service === "undefined") {
            throw new Error(`${key} has not been registered.`);
        }

        if (service.scope == "global") {
            return this.parentLocator.resolve(key);
        }

        console.log()
        const tokens = Reflect.getMetadata("design:paramtypes", service.type) || [];
        console.log('tokens', tokens);
        // const injections = tokens.map((token: Type<any>): any =>
        // Injector.resolve(token)
        // );

        var dependencies: any[] = [];
        service.dependencyTypes.forEach(dependency => {
            console.log('GET lookiung up', dependency)
            var dep = this.resolve(dependency);
            dependencies.push(dep);
        });

        instance = new service.type(...dependencies);
        this.instances.set(service.key, instance);

        return instance;

    }
}