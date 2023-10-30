import { IPageContext } from "./IPageContext";

/**
 * A component represents a 
 */
export interface IPage{

    /**
     * Features that are brought to all components.
     */
    context: IPageContext;

    /**
     * Initialize component.
     * 
     * Initialize is done before the view is being rendered. Use it to load data etc.
     */
    initialize(): Promise<void>;
}
