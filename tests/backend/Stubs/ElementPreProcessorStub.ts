import { ITextNodeProcessor } from "../../../src/Backend/Views/Analyzers/Index";
import { IViewBuilderProcessorContext } from "../../../src/Backend/Views/Contexts";
import { IElementPreProcessor, Result } from "../../../src/Backend/Views/Preprocessors/Index";

export class ElementProcessorStub implements IElementPreProcessor {
    constructor(private canHandle: boolean) {
    }

    invoked = false;
    resultToReturn: Result = Result.Processed;

    analyze(element: HTMLElement): boolean {
        return this.canHandle;
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext): Result {
        this.invoked = true;
        return this.resultToReturn;
    }

}

export class TextNodeProcessorStub implements ITextNodeProcessor {
    constructor(private canHandle: boolean) {
    }

    invoked = false;
    resultToReturn: boolean = true;

    analyze(node: Node): boolean {
        return this.canHandle;
    }

    process(node: Node, context: IViewBuilderProcessorContext): boolean {
        this.invoked = true;
        return this.resultToReturn;
    }

}