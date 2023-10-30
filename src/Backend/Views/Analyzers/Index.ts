import { IScope2 } from "../Contexts";

export interface IElementProcessor{
    analyze(element: HTMLElement): boolean;
    process(element: HTMLElement, context: IScope2): void;
}

export interface ITextNodeProcessor {
    analyze(node: Node): boolean;
    process(node: Node, context: IScope2): boolean;
}
