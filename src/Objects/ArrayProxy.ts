/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SubscriptionService, Subscription, EventHandler } from "./Notifications";
import { isProxySymbol } from "./ProxyTools";

export enum ListNotificationType {
    Added,
    Updated,
    Removed
}

export interface ListNotification<T> {
    notificationType: ListNotificationType;

    /**
     * Index is set when an element is set to a specific position.
     * 
     * When many items are modified, this is the first index.
     */
    index: number;

    /**
     * Item that was added/modified/removed.
     */
    items: T[];
}

const ourMethods =  ['pop', 'push', 'shift', 'unshift'];

const IsArrayProxySymbol = Symbol('__isArrayProxy');

export function isArrayProxy(obj: any): boolean{
    return obj[IsArrayProxySymbol] === true;
}

export interface IArrayProxy{
    arrayChanges: Subscription<ListNotification<unknown>>;
}

export class ArrayProxyHandler implements ProxyHandler<Array<unknown>>, IArrayProxy {
    private subscribers: SubscriptionService<ListNotification<unknown>>;

    constructor() {
        this.subscribers = new SubscriptionService<ListNotification<unknown>>();
    }

    arrayChanges: Subscription<ListNotification<unknown>> = new SubscriptionService<ListNotification<unknown>>;

    subscribe(receiver: EventHandler<ListNotification<unknown>>): void {
        this.subscribers.subscribe(receiver);
    }
    unsubscribe(receiver: EventHandler<ListNotification<unknown>>): void {
        this.subscribers.unsubscribe(receiver);
    }


    deleteProperty?(_target: unknown[], _p: string | symbol): boolean {
        console.log('delete property ', _p);
        return true;
    }

    get(target: any, key: string | symbol): any {
        if (key == isProxySymbol) {
            return true;
        }
        if (key == IsArrayProxySymbol){
            return true;
        }

        const keyAsStr = key.toString();

        const value = target[key];

        if (typeof value === 'function') {
            if (ourMethods.indexOf(keyAsStr) === -1){
                return value.bind(target);
            }

            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            // eslint-disable-next-line prefer-rest-params
            const elements = Array.from(arguments);

            if (keyAsStr == 'pop') {
                return function () {
                    const index = target.length - 1;
                    const result = Array.prototype[<any>keyAsStr].apply(target, elements);
                    self.subscribers.notify(target, { index, notificationType: ListNotificationType.Removed, items: elements })
                    return result;
                }
            }
            if (keyAsStr == 'push') {
                return function () {
                    const result = Array.prototype[<any>keyAsStr].apply(target, elements);
                    const index = target.length - 1;
                    self.subscribers.notify(target, { index, notificationType: ListNotificationType.Added, items: elements })
                    return result;
                }
            }
            if (keyAsStr == 'shift') {
                return function () {
                    const result = Array.prototype[<any>keyAsStr].apply(target, elements);
                    self.subscribers.notify(target, { index: 0, notificationType: ListNotificationType.Removed, items: elements })
                    return result;
                }
            }
            if (keyAsStr == 'unshift') {
                return function () {
                    const result = Array.prototype[<any>keyAsStr].apply(target, elements);
                    self.subscribers.notify(target, { index: 0, notificationType: ListNotificationType.Added, items: elements })
                    return result;
                }
            }
            // if (keyAsStr == 'push') {
            //     return function (el: any) {
            //         var result = Array.prototype[<any>keyAsStr].apply(target, arguments);
            //         var index = target.length - 1;
            //         self.subscribers.notify(target, {index, notificationType: ListNotificationType.Added, items: Array.from(arguments)})
            //         return result;
            //     }
            // }


        }

        return value;
    }

    set(target: any, key: string | symbol, newValue: unknown): boolean {
        target[key] = newValue;

        const index = parseInt(key.toString(), 10);
        if (!isNaN(index)) {
            // eslint-disable-next-line prefer-rest-params
            this.subscribers.notify(target, { index: index, notificationType: ListNotificationType.Removed, items: Array.from(arguments) })
        }

        return true;
    }

}

/*
    private wrapInProxies(parent: any, elements: any[]) {
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (!isProxy(element)) {
                elements[index] = createProxy(element, {parent, path: index.toString()})
            }

            var e2 = elements[index];
            if (!isArrayProxy(e2)){
                e2.
            }
        }
    }
*/