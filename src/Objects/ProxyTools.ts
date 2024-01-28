/**
 * This symbol identifies proxies so that proxies doesn't isn't applied to proxies.
 * 
 * Used to test if the object has a property that returns true for this symbol (= proxy).
 */
export let isProxySymbol = Symbol("__isProxy")

export function isProxy(obj: any): boolean{
    return obj[isProxySymbol];
}

export interface ProxyFactoryOptions {
    parent: any;
    path: string
}

export type createProxyCallback = (instance: any, options?: ProxyFactoryOptions) => any;

/**
 * Takes care of ensuring that values are wrapped in proxies.
 * 
 * Use this class inside proxy handlers to facilitate all proxies registered
 * within this library.
 */
export class ProxyValueHandler {

    constructor(private parentInstance: any, private path: string, private createProxy: createProxyCallback) {
    }

    /**
     * Set this property to adjust how the path is generated.
     * 
     * The path is access path taken to reach the current value. For instance `data.users[0].id`.
     */
    pathModifier?: (key: string | symbol, basePath: string) => string;

    get(target: any, key: string | symbol): any {
        console.log('get', key, " from ", target);

        if (key == isProxySymbol) {
            return true;
        }

        var value = target[key];
        if (isProxy(value)) {
            return value;
        }

        // don't generate proxies for symbol/primitive/function types.
        if (typeof value !== 'object') {
            return value;
        }

        // only time we get here is when a we've wrapped an
        // existing complex object without having accessed the
        // child before.
        var proxy = this.createProxy({instance: value, path: key.toString(), parent: target});
        target[key] = proxy;

        return proxy;
    }

    /***
     * Set value
     * 
     * @returns true when the value was changed.
     */
    set(target: any, key: string | symbol, newValue: any): boolean {
        console.log('set', newValue, ' to', key, ' in object ', target);

        var oldValue = target[key];
        if (oldValue === newValue) {
            return false;
        }

        if (isProxy(oldValue)) {
            console.log(`removing old child`);
            oldValue.parent = undefined;
        }

        if (isProxy(newValue)) {
            console.log(`value is already a new proxy`);
            newValue.parent = this.instance;
        }

        if (typeof newValue === 'object') {
            var proxy = this.createProxy({instance: newValue, path: key.toString(), parent: target});
            target[key] = proxy;
        } else {
            // dont create a proxy for symbol/function types.
            target[key] = newValue;
        }


        return true;
    }

    delete(target: any, key: string | symbol): boolean {
        var value = target[key];

        if (!(key in target)) {
            return false;
        }

        if (isProxy(value)) {
            console.log(`removing old child`);
            value.parent = undefined;
        }

        target.removeItem(key);
        return true;
    }

}