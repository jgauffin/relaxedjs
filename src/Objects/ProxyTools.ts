/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * This symbol identifies proxies so that proxies doesn't isn't applied to proxies.
 *
 * Used to test if the object has a property that returns true for this symbol (= proxy).
 */
export const isProxySymbol = Symbol('__isProxy');

export type UnknownType = Record<string | symbol, any>;

export function isValueProxy(obj: any): boolean {
    return obj[isProxySymbol];
}

export function isValueProxable(obj: unknown): boolean{
    if (typeof obj == "function"){
        return false;
    }

    return typeof obj === "object";
}

export interface ProxyFactoryOptions {
    parent: ParentNotifier;
    path: string;
}

/**
 * Allows chained notifications between proxy handlers without subscriptions
 */
type ParentNotifier = (item: unknown, key: symbol | string) => void;

export type createProxyCallback = (instance: unknown, options?: ProxyFactoryOptions) => any;

/**
 * Takes care of ensuring that values are wrapped in proxies.
 *
 * Use this class inside proxy handlers to facilitate all proxies registered
 * within this library.
 */
export class ProxyValueHandler {
    constructor(private createProxy: createProxyCallback, private options?: ProxyFactoryOptions) {}

    /**
     * Set this property to adjust how the path is generated.
     *
     * The path is access path taken to reach the current value. For instance `data.users[0].id`.
     */
    pathModifier?: (key: string | symbol, basePath: string) => string;

    get(target: any, key: string | symbol): unknown {
        console.log('get', key, ' from ', target);

        if (key == isProxySymbol) {
            return true;
        }

        const value = target[key];
        if (isValueProxy(value)) {
            return value;
        }

        // don't generate proxies for symbol/primitive/function types.
        if (typeof value !== 'object') {
            return value;
        }

        // only time we get here is when a we've wrapped an
        // existing complex object without having accessed the
        // child before.
        const proxy = this.createProxy({ instance: value, path: key.toString(), parent: target });
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

        const oldValue = target[key];
        if (oldValue === newValue) {
            return false;
        }

        if (isValueProxy(oldValue)) {
            console.log(`removing old child`);
            oldValue.parent = undefined;
        }

        if (isValueProxy(newValue)) {
            console.log(`value is already a new proxy`);
            newValue.parentNotifier = (target: any, key: string | symbol) =>
                this.onChildChange(target, key);
        }

        if (typeof newValue === 'object') {
            const proxy = this.createProxy({
                instance: newValue,
                path: key.toString(),
                parent: target,
            });
            target[key] = proxy;
        } else {
            // dont create a proxy for symbol/function types.
            target[key] = newValue;
        }

        return true;
    }

    delete(target: any, key: string | symbol): boolean {
        const value = target[key];

        if (!(key in target)) {
            return false;
        }

        if (isValueProxy(value)) {
            console.log(`removing old child`);
            value.parent = undefined;
        }

        target.removeItem(key);
        return true;
    }

    private onChildChange(target: any, key: string | symbol) {}
}
