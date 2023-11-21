import { IViewBuilderProcessorContext } from "../Contexts";
import { IElementPreProcessor, Result } from "./Index";

export class IfAttribute implements IElementPreProcessor {

    analyze(element: HTMLElement): boolean {
        var has = element.hasAttribute('if');
        if (has) {
            console.log('got if ' + element.outerHTML);
        }
        return has;
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext): Result {
        var attrValue = element.getAttribute('if');
        if (attrValue == null) {
            return Result.NotProcessed;
        }

        element.removeAttribute('if');

        context.methodBuilder.appendLineIndent(`if (context.data.${attrValue}) {`);
        console.log('if context ' + element.outerHTML);
        context.processChildNode(element);
        context.methodBuilder.dedentAppendLine('}');
        return Result.StopProcessing;
    }
}
export class UnlessAttribute implements IElementPreProcessor {
    analyze(element: HTMLElement): boolean {
        return element.hasAttribute('unless');
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext): Result {
        var attrValue = element.getAttribute('unless');
        if (attrValue == null) {
            return Result.NotProcessed;
        }

        element.removeAttribute('unless');

        context.methodBuilder.appendLineIndent(`if (!(context.data.${attrValue})) {`);
        console.log('unless context');
        context.processChildNode(element);
        context.methodBuilder.dedentAppendLine('}');
        return Result.StopProcessing;
    }
}

export class ElseAttibute implements IElementPreProcessor {
    analyze(element: HTMLElement): boolean {
        return element.hasAttribute('else');
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext): Result {
        var attrValue = element.getAttribute('else');
        if (attrValue == null) {
            return Result.NotProcessed;
        }

        console.log('ELSE');
        element.removeAttribute('else');
        console.log('inner', element.outerHTML)

        context.methodBuilder.appendLineIndent(`else {`);
        console.log('else context');
        context.processChildNode(element);
        context.methodBuilder.dedentAppendLine('}');
        return Result.StopProcessing;
    }
}