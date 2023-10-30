import { IScope2 } from "../Contexts";

export enum Result{

    /**
     * The node was not relevant for the processor.
     */
    NotProcessed,

    /**
     * The node was processed.
     */
    Processed,

    /**
     * The node was processed and it should not be processed further.
     */
    StopProcessing,
    
}
export interface IElementPreProcessor {
    analyze(element: HTMLElement): boolean;
    process(element: HTMLElement, context: IScope2): Result;
}

