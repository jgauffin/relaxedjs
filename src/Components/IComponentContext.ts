import { IWire } from "../Signals/ISignalReceiver";

/**
 * Component attached to @see IComponent.
 */
export interface IComponentContext{

    /**
     * Parameters passed through attributes on the component tag markup.
     * 
     * @see IBus
     */
    params: Map<string, any>;

    /**
     * Used to redraw the view when data has changed.
     * 
     * This system only redraw views initially and when the route changes. Implement @see IComponentInit and/or @see IComponentUpdate to be sure
     * to fetch data before the view is drawn, or simply invoke this method when the data is ready.
     */
    redraw(): void;

    /**
     * Will pull data from forms into data object.
     */
    readData(): any;

    /**
     * Signal other part of the system.
     * 
     * This is the primary way to handle communication between views. Implement IMessageHandler in all components that should receive messages (one message can be sent to many).
     * Subscription is automatically managed.
     * 
     * @param message Message to send.
     */
    signal: IWire;

}



