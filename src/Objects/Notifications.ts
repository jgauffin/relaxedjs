
/**
 * A class that can recive change notifications from another object.
 */
export interface PropertyChangeReceiver {
    /**
     * 
     * @param instance Object that changed.
     * @param key Typically a property name, but can also be an index if it's a collection that changed.
     */
    propertyChanged(instance: any, key: string|symbol): void;
}

/**
 * Represents the object that decides if a change notification should be made or not.
 * 
 * Dividing this interface and the actual subscription management is useful since
 * this let's us manage notification chains without having to deal with the subscriptions
 * directly.
 */
export interface PropertyChangeNotifier {

    notify(instance: any, propertyName: string|symbol): void;
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
    subscribe(receiver: EventHandler<TReceiver>): void;
    unsubscribe(receiver: EventHandler<TReceiver>): void;
}


/**
 * Represents the object that supports change notifications.
 * 
 * Allows us to manage subscriptions.
 */
export interface PropertyChangeSubscription  {

    /**
     * 
     * @param receiver object that want to receive notifications.
     */
    subscribe(receiver: PropertyChangeReceiver): void;
    unsubscribe(receiver: PropertyChangeReceiver): void;
}

export type EventHandler<T> = (source: any, e: T) => void;


/**
 * Service that takes care of notifying all change event subscribers.
 */
export class SubscriptionService<T> implements Subscription<T> {
    private receivers: EventHandler<T>[] = [];

    constructor(){

    }
    
    parentNotifier?: () => void;

    subscribe(receiver: EventHandler<T>): void {
        this.receivers.push(receiver);
    }

    unsubscribe(receiver: EventHandler<T>): void {
        var index = this.receivers.indexOf(receiver);
        if (index === -1) {
            throw new Error("Failed to find reciever " + receiver + " in change notifier.");
        }

        this.receivers.splice(index, 1);
    }

    notify(source: any, args: T): void {
        if (this.parentNotifier) {
            this.parentNotifier();
        }

        this.receivers.forEach(x => x(source, args));
    }
}
