import { IViewBuilderProcessorContext } from "../Contexts";

export interface IElementProcessor{
    analyze(element: HTMLElement): boolean;
    process(element: HTMLElement, context: IViewBuilderProcessorContext): void;
}

/**
 * Processes pure texts (either text nodes or values in HTML attributes).
 */
export interface ITextNodeProcessor {
    /**
     * 
     * @param node Node which is being processed by the view builder.
     */
    analyze(node: Node): boolean;
    process(node: Node, context: IViewBuilderProcessorContext): boolean;
}
