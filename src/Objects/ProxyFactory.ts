import { ArrayProxyHandler } from "./ArrayProxy";
import { DataProxyHandler } from "./DataProxy";
import { ProxyFactoryOptions } from "./ProxyTools";

export function createProxy(instance: any, options?: ProxyFactoryOptions): any {

    //var path = this.appendPath(keyInParent.toString());

    if (Array.isArray(instance)) {
        const handler = new ArrayProxyHandler();
        return new Proxy(instance, handler);
    }
    else {
        const handler = new DataProxyHandler(instance);
        return new Proxy(instance, handler);
    }
}

function appendPath(key: string | symbol): string {

    if (this.parentPath === '') {
        return key.toString();
    }

    if (typeof key == 'symbol') {
        `${this.parentPath}[${this.appendPath}]`
    }

    return `${this.parentPath}.${this.appendPath}`
}

