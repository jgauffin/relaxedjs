import { IViewBuilderProcessorContext } from "../Contexts";
import { IElementProcessor } from "./Index";

export class LinkProcessor implements IElementProcessor {
    analyze(element: HTMLElement): boolean {
        return element.tagName === 'A';
    }
    process(element: HTMLElement, context: IViewBuilderProcessorContext): void {
        if (!element.getAttribute("href")) {
            element.setAttribute("href", "#");
        }

        var name = element.getAttribute("name");
        var method = context.viewResult.component.findMethod(name ?? "noop");
        if (!method) {
            context.logger.warning("Binding", context.viewPath, `Component does not have specified function. Can't bind event 'click' to '${name}'.`);
            return;
        }

        if (method) {
            context.methodBuilder.appendLine(`this.bindActions.push(() => ${context.variableName}.addEventListener('click', e => context.component['${name}'](e), { signal: this.controller.signal }));`);
        }
    }
}

///
export class AttributePrefixModifier implements IElementProcessor {

    analyze(element: HTMLElement): boolean {
        for (let index = 0; index < element.attributes.length; index++) {
            const attribute = element.attributes[index];

            if (attribute.name[0] == '+' || attribute.name[0] == ':') {
                return true;
            }
            if (attribute.value.match(/[\+:][a-zA-Z_\-0-9]/)) {
                return true;
            }
        }

        return false;
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext) {
        var methodBuilder = context.methodBuilder;
        let attributesToRemove: string[] = [];
        for (let index = 0; index < element.attributes.length; index++) {
            const attribute = element.attributes[index];


            // format value as number.
            if (attribute.name[0] == '+') {
                attributesToRemove.push(attribute.name);
                //methodBuilder.appendLine(`if (context.data.${attribute.name.substring(1)}) {`);
                methodBuilder.appendLine(`${context.variableName}.setAttribute("${attribute.name.substring(1)}", context.data.${attribute.value});`);
                methodBuilder.appendLine(`${context.variableName}.setAttribute("data-type", "number");`);
                //methodBuilder.appendLine('}');
            } else if (attribute.name[0] == ':') {
                console.log(':' + attribute.name);
                attributesToRemove.push(attribute.name);
                methodBuilder.appendLine(`${context.variableName}.setAttribute("${attribute.name.substring(1)}", context.data.${attribute.value});`);
                methodBuilder.appendLine(`${context.variableName}.setAttribute("data-type", "number");`);
            }
            else if (attribute.value.match(/[\+:][a-zA-Z_\-0-9]+/)) {
                console.log('splt' + attribute.name);
                //TODO: split between them
            }
            // else {
            //     attributesToRemove.push(attribute.name);
            //     methodBuilder.appendLine(`${context.variableName}.setAttribute("${attribute.name}", "${attribute.value}")`);
            // }
        }

        attributesToRemove.forEach(attr => {
            element.removeAttribute(attr);
        });
    }

}


/**
 * Button events.
 * 
 * Buttons have special logic since most other tags requires a name attribute to make sense in the view model.
 * But for buttons, having a onSubmit or onReset method in the view model is perfectly logical.
 * 
 * Therefore, this analyzer will first try to create binding using the name attribute, but if missing it will use
 * the button type instead.
 */
export class ButtonEventAnalyzer implements IElementProcessor {

    analyze(e: HTMLElement): boolean {
        return e.tagName == 'BUTTON' || this.isInputButton(e);
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext): void {
        const typeAttribute = element.getAttribute('type')?.toLowerCase();
        const nameAttribute = element.getAttribute('name');

        var functionName = '';
        var eventName = '';

        if (nameAttribute) {
            functionName = 'on' + nameAttribute.substring(0, 1).toUpperCase() + nameAttribute.substring(1);
            eventName = 'click';
        } else if (typeAttribute) {
            functionName = 'on' + typeAttribute?.substring(0, 1).toUpperCase() + typeAttribute.substring(1);
            eventName = 'click';
        } else {
            functionName = 'onClick';
            eventName = 'click';
        }

        this.bindEvent(context, eventName, functionName, element);
    }

    bindEvent(context: IViewBuilderProcessorContext, eventName: string, functionName: string, el: HTMLElement) {
        var method = context.viewResult.component.findMethod(functionName);
        if (!method) {

            context.logger.error("Binding", context.viewPath, `Component '${context.viewResult.component.className}' does not have a function named '${functionName}'. Can't bind event '${eventName}' for HTML element ${el.tagName}.`)
        }

        context.methodBuilder.appendLine(`this.bindActions.push(() => ${context.variableName}.addEventListener('${eventName}', e => context.component['${functionName}'](e), { signal: this.controller.signal }));`);
    }

    private isInputButton(element: HTMLElement): boolean {
        const typeAttribute = element.getAttribute('type')?.toLowerCase();
        return element.tagName == "INPUT" && (typeAttribute == 'reset' || typeAttribute == 'submit' || typeAttribute == "button");
    }

}