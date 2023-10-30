/**
 * Component must be initialized before view render.
 */
 export interface IInitialize{
    /**
     * Do actions before the view is rendered for the first time.
     */
    initialize(): Promise<void>;
}


export function hasInitialize(instance: any): instance is IInitialize {
    return 'initialize' in instance;
}
