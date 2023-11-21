import { IViewBuilderProcessorContext } from "../Contexts";
import { StringBuilder } from "../../Utils/StringBuilder";
import { IElementPreProcessor, Result } from "./Index";

export class ForModifier implements IElementPreProcessor {

    analyze(element: HTMLElement): boolean {
        return element.hasAttribute('for');
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext): Result {
        var attrValue = element.getAttribute('for');
        if (attrValue == null) {
            return Result.NotProcessed;
        }

        element.removeAttribute('for');

        var methodIndex = context.viewResult.getNextMethodIndex();
        var rowMethodName = `appendForRow${methodIndex}`;
        var forMethodName = `forLoop${methodIndex}`;

        context.methodBuilder.appendLine(`this.${forMethodName}(${context.parentVariableName}, context);`)

        var forLoopMethod = new StringBuilder(4);
        forLoopMethod.appendLineIndent(`${forMethodName}(parent, context) {`);
        forLoopMethod.appendLine('let tempNode = document.createElement("table");');
        forLoopMethod.appendLineIndent(`for (var item of context.data.${attrValue}) {`);
        forLoopMethod.appendLine(`context.data.item = item;`);
        forLoopMethod.appendLine(`this.${rowMethodName}(tempNode, context, item);`);
        ///sb.appendLine('e.appendChild(childElement)');
        forLoopMethod.dedentAppendLine('}');
        forLoopMethod.appendLine('parent.replaceChildren(...tempNode.children);');
        forLoopMethod.dedentAppendLine('}');
        context.viewResult.addMethod(forLoopMethod);

        var elementRenderMethod = new StringBuilder(4);
        context.viewResult.addMethod(elementRenderMethod);

        elementRenderMethod.appendLineIndent(`${rowMethodName}(parent, context, item) {`);
        var meta = context.data.find(x=>x.name == attrValue);
        if (!meta){
            throw new Error(`Failed to find '${attrValue}' in the data.`);
        }

        var scope = context.createContext(element.tagName, 'parent', 'i', elementRenderMethod);
        console.log('for context');
        context.processChildNode(element, scope);
        elementRenderMethod.dedentAppendLine('}');

        return Result.StopProcessing;
    }
}
