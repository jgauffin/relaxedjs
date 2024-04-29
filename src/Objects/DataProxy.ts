import { PropertyChangeSubscription, SubscriptionService, PropertyChangeReceiver, PropertyChangedData, Subscription } from "./Notifications";
import { createProxyCallback, isValueProxy, ProxyValueHandler } from "./ProxyTools";



/**
 * Handles changes to objects.
 * 
 * 
 */
export class DataProxyHandler implements ProxyHandler<any>, PropertyChangeSubscription {
    private subscribers = new SubscriptionService<PropertyChangedData>();

    constructor(private path: string, private proxyFactory: createProxyCallback) {
    }



    get subscription(): Subscription<PropertyChangedData>
    {
        return this.subscribers;
    }


    get(target: any, key: string | symbol): any {
        return this.valueHandler.get(target, key);
    }

    set(target: any, key: string | symbol, newValue: any, _receiver: any): boolean {
        const oldValue = target[key];
        if (oldValue === newValue) {
            return false;
        }

        if (isValueProxy(oldValue)) {
            console.log(`removing old child`);
            oldValue.unsubscribe(this);
        }

        if (typeof newValue === 'object') {
            if (isValueProxy(newValue)) {
                console.log(`value is already a new proxy, old parent: ${newValue.parentNotifier}`);
            } else{
                newValue = this.proxyFactory({
                    instance: newValue,
                    path: `${this.path}.${key.toString()}`,
                    parent: target,
                });
            }

            newValue.subscribe(this, (source: Record<string|unknown>,e:) => {
                this.subscribers.notify()
            })
            this.onChildChange(target, key);

        } else {
            // dont create a proxy for symbol/function types.
            target[key] = newValue;
        }

        return true;
    }

    deleteProperty(target: Record<string, unknown>, key: string | symbol): boolean {
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

    getOwnPropertyDescriptor(target: any, key: string | symbol): PropertyDescriptor|undefined {
        console.log('getOwnPropertyDescriptor', target, key);
        let value = target[key];
        if (isValueProxy(value)) {
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
