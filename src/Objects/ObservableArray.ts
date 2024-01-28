import { PropertyChangeSubscription, SubscriptionService, PropertyChangeReceiver, Subscription, EventHandler } from "./Notifications";
import { GotParent, ProxyValueHandler, isProxy } from "./ProxyTools";

enum ListNotificationType {
    Added,
    Updated,
    Removed
}

export interface ListNotification<T>{
    notificationType: ListNotificationType;
index: number;
item?: T;
key?: symbol|string
};

export interface ListNotificationReciever<T>{
    handler: EventHandler<ListNotificationReciever<T>>;
}


/**
 * The observable list monitor for changes within the elements that are stored in the list.
 * 
 * Change notifications will contain a symbol (array index) for list changes or 
 */
export class ObservableList<T> implements Subscription<ListNotificationReciever<T>>, GotParent {
    private subscription = new SubscriptionService()
    private valueHandler:ProxyValueHandler;
    private inner: T[];
    private needInnerProxy = false;
    
     constructor(items: T[]) {
        this.valueHandler = new ProxyValueHandler(this, '');
        this.inner = items;
        this.needInnerProxy

        // We need to check for proxies here
        // since the dev might change objects directly 
        // and not by accessing them through the array.
        for (let index = 0; index < items.length; index++) {
            let element = <any>items[index];
            if (!element[isProxy]){
                items[index] = createProxy()
            }
        }

    }
    subscribe(receiver: ListNotificationReciever<T>): void {
        this.subscription.subscribe(receiver);
    }
    unsubscribe(receiver: ListNotificationReciever<T>): void {
        this.subscription.unsubscribe(receiver);
    }

    get(index: number): T{
        if (!this.inner[isProxy]){

        }
    }
    set parent(value: GotParent) {
        
    }

   
}
