import { SubscriptionService, Subscription, EventHandler } from "./Notifications";
import { createProxy } from "./ProxyFactory";
import { isProxy, isProxySymbol } from "./ProxyTools";

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
};

export interface ListElementNotification<T>{
    index: number;

    /**
     * Key when the operation is indexed.
     */
    key?: symbol | string

    element: T;
}

const ourMethods =  ['pop', 'push', 'shift', 'unshift'];

const IsArrayProxySymbol = Symbol('__isArrayProxy');

export function isArrayProxy(obj: any): boolean{
    return obj[IsArrayProxySymbol] === true;
}

export interface IArrayProxy{
    arrayChanges: Subscription<ListNotification<any>>;
    elementChanges: Subscription<ListElementNotification<any>>;
}

export class ArrayProxyHandler implements ProxyHandler<Array<any>>, IArrayProxy {
    private subscribers: SubscriptionService<ListNotification<any>>;

    constructor(parentNotifier?: () => void) {
        this.subscribers = new SubscriptionService<ListNotification<any>>();
        this.subscribers.parentNotifier = parentNotifier;
    }

    arrayChanges: Subscription<ListNotification<any>> = new SubscriptionService<ListNotification<any>>;
    elementChanges: Subscription<ListElementNotification<any>> = new SubscriptionService<ListElementNotification<any>>;;

    subscribe(receiver: EventHandler<ListNotification<any>>): void {
        this.subscribers.subscribe(receiver);
    }
    unsubscribe(receiver: EventHandler<ListNotification<any>>): void {
        this.subscribers.unsubscribe(receiver);
    }


    deleteProperty?(_target: any[], _p: string | symbol): boolean {
        console.log('delete property ', _p);
        return true;
    }

    get(target: any, key: string | symbol, _receiver: any) {
        if (key == isProxySymbol) {
            return true;
        }
        if (key == IsArrayProxySymbol){
            return true;
        }

        var keyAsStr = key.toString();

        const value = target[key];

        if (typeof value === 'function') {
            if (ourMethods.indexOf(keyAsStr) === -1){
                return value.bind(target);
            }

            var self = this;
            var elements = Array.from(arguments);
            this.wrapInProxies(target, elements);

            if (keyAsStr == 'pop') {
                return function () {
                    const index = target.length - 1;
                    var result = Array.prototype[<any>keyAsStr].apply(target, elements);
                    self.subscribers.notify(target, { index, notificationType: ListNotificationType.Removed, items: elements })
                    return result;
                }
            }
            if (keyAsStr == 'push') {
                return function () {
                    var result = Array.prototype[<any>keyAsStr].apply(target, elements);
                    const index = target.length - 1;
                    self.subscribers.notify(target, { index, notificationType: ListNotificationType.Added, items: elements })
                    return result;
                }
            }
            if (keyAsStr == 'shift') {
                return function () {
                    var result = Array.prototype[<any>keyAsStr].apply(target, elements);
                    self.subscribers.notify(target, { index: 0, notificationType: ListNotificationType.Removed, items: elements })
                    return result;
                }
            }
            if (keyAsStr == 'unshift') {
                return function () {
                    var result = Array.prototype[<any>keyAsStr].apply(target, elements);
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

    private wrapInProxies(parent: any, elements: any[]) {
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (!isProxy(element)) {
                elements[index] = createProxy(element, {parent, path: index.toString()})
            }
        }
    }

    set(target: any, key: string | symbol, newValue: any, _receiver: any): boolean {
        target[key] = newValue;

        var index = parseInt(key.toString(), 10);
        if (!isNaN(index)) {
            this.subscribers.notify(target, { index: index, notificationType: ListNotificationType.Removed, items: Array.from(arguments) })
        }

        return true;
    }

}