
/**
 * Component must be initialized before view render.
 */
export interface ICleanup{
    /**
     * Do actions before the view is rendered for the first time.
     */
    cleanup(): Promise<void>;
}



export function hasCleanup(instance: any): instance is ICleanup {
    return 'cleanup' in instance;
}
