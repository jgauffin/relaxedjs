import { IScope2 } from "../Contexts";
import { IElementProcessor } from "./Index";


/**
 * Looks for all attributes prefixed with 
 */
export class FormSubmitAnalyzer implements IElementProcessor {

    analyze(element: HTMLElement): boolean {
        return false;
    }
    process(element: HTMLElement, context: IScope2): void {

        if (element.tagName != 'FORM') {
            return;
        }

        const clickAttribute = element.getAttribute('click');
        const nameAttribute = element.getAttribute('name');

        var functionName = '';
        var eventName = '';
        if (clickAttribute) {
            functionName = 'on' + clickAttribute?.substring(0, 1).toUpperCase() + clickAttribute.substring(1);
            eventName = 'click';
        }

        else if (nameAttribute) {
            functionName = 'on' + nameAttribute?.substring(0, 1).toUpperCase() + nameAttribute.substring(1);
            eventName = 'submit';
        }

        else {
            functionName = 'onSubmit';
            eventName = 'submit';
        }

        this.bindEvent(context, eventName, functionName);
    }

    bindEvent(context: IScope2, eventName: string, functionName: string) {
        var method = <any>context.viewResult.component.findMethod(functionName);
        if (!method) {
            throw new Error(`Component '${context.viewResult.component.className}' does not have requested function. Can't bind event '${eventName}' to function '${functionName}'.`)

        }

        context.methodBuilder.appendLine(`this.bindActions.push(() => ${context.variableName}.addEventListener('${eventName}', e => {`);
        context.methodBuilder.appendLine('    var reader = new FormReader();');
        context.methodBuilder.appendLine('    var data = reader.read(el);');
        context.methodBuilder.appendLine(`    context.component['${functionName}'](e, data));`);
        context.methodBuilder.appendLine('}));');
    }

}