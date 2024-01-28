import { PropertyChangeSubscription, SubscriptionService, PropertyChangeReceiver } from "./Notifications";
import { GotParent, isProxy, ProxyValueHandler } from "./ProxyTools";




/**
 * Handles changes to objects.
 * 
 * 
 */
export class DataProxyHandler implements ProxyHandler<any>, PropertyChangeSubscription, GotParent {
    private subscribers = new SubscriptionService();
    private valueHandler: ProxyValueHandler;

    constructor(path: string, parentNotifier?: () => void, protected someCoolInstance?: any) {
        this.subscribers.parentNotifier = parentNotifier;
        this.valueHandler = new ProxyValueHandler(this, path);
    }

    subscribe(receiver: PropertyChangeReceiver): void {
        this.subscribers.subscribe(receiver);
    }
    unsubscribe(receiver: PropertyChangeReceiver): void {
        this.subscribers.unsubscribe(receiver);
    }

    set parent(value: GotParent | undefined) {
        this.subscribers.parentNotifier = value;
    }

    get(target: any, key: string | symbol): any {
        return this.valueHandler.get(target, key);
    }

    set(target: any, key: string | symbol, newValue: any, _receiver: any): boolean {

        var changed = this.valueHandler.set(target, key, newValue);
        if (changed) {
            this.subscribers.notify(target, key.toString());
        }

        return changed;
    }

    deleteProperty(target: any, key: string | symbol): boolean {
        console.log('deleteProperty', target, key);
        return this.valueHandler.delete(target, key);
    }

    ownKeys(target: any) {
        console.log('ownKeys', target);
        return target.keys();
    }

    has(target: any, key: string | symbol): boolean {
        console.log('has', key, ' in ', target);
        return key in target || target.hasItem(key);
    }

    defineProperty(target: any, key: string | symbol, descriptor: PropertyDescriptor): boolean {
        console.log('defineProperty', key, ' in object ', target,);
        if (descriptor && "value" in descriptor) {
            target.setItem(key, descriptor.value);
        }
        return target;
    }

    getOwnPropertyDescriptor(target: any, key: string | symbol) {
        console.log('getOwnPropertyDescriptor', target, key);
        let value = target[key];
        if (value[isProxy]) {
            console.log('is proxy!')
            value = value.someCoolInstance;
        }
        if (!value) {
            console.log('error, getOwnPropertyDescriptor', target, key);
        }
        return value
            ? {
                value,
                writable: true,
                enumerable: true,
                configurable: false,
            }
            : undefined;
    }
}
