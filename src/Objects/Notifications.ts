/**
 * A class that can recive change notifications from another object.
 */
export interface PropertyChangeReceiver {
    /**
     *
     * @param instance Object that changed.
     * @param key Typically a property name, but can also be an index if it's a collection that changed.
     */
    propertyChanged(instance: Record<string, unknown>, key: string | symbol): void;
}

/**
 * Represents the object that decides if a change notification should be made or not.
 *
 * Dividing this interface and the actual subscription management is useful since
 * this let's us manage notification chains without having to deal with the subscriptions
 * directly.
 */
export interface PropertyChangeNotifier {
    notify(instance: Record<string, unknown>, propertyName: string | symbol): void;
}

export interface PropertyChangedData {
    instance: Record<string, unknown>;
    key: string | symbol;
}

/**
 * Represents the object that supports change notifications.
 *
 * Allows us to manage subscriptions.
 */
export interface Subscription<TReceiver> {
    /**
     *
     * @param receiver object that want to receive notifications.
     */
    subscribe(key: unknown, receiver: EventHandler<TReceiver>): void;
    unsubscribe(key: unknown): void;
}

/**
 * Represents the object that supports change notifications.
 *
 * Allows us to manage subscriptions.
 */
export interface PropertyChangeSubscription {
    /**
     *
     * @param receiver object that want to receive notifications.
     */
    subscribe(receiver: PropertyChangeReceiver): void;
    unsubscribe(receiver: PropertyChangeReceiver): void;
}

export type EventHandler<T> = (source: Record<string, unknown>, e: T) => void;

class Subscriber<T> {
    constructor(private key: unknown, handler: EventHandler<T>) {}
}

/**
 * Service that takes care of notifying all change event subscribers.
 */
export class SubscriptionService<T> implements Subscription<T> {
    private receivers: Subscriber<T>[] = [];

    subscribe(key: unknown, receiver: EventHandler<T>): void {
        this.receivers.push(new Subscriber(key, receiver));
    }

    unsubscribe(key: unknown): void {
        while (true) {
            const index = this.receivers.findIndex((x) => x.key == key);
            if (index === -1) {
                break;
            }

            this.receivers.splice(index, 1);
        }
    }

    notify(source: Record<string, unknown>, args: T): void {
        this.receivers.forEach((x) => x(source, args));
    }
}
