/**
 * Route-data or params has been updated for the component.
 */
 interface IComponentUpdate{
    /**
     * Fetch data from backend or invoke any other action required before the view is updated.
     */
    updateComponent(): Promise<void>;
}
