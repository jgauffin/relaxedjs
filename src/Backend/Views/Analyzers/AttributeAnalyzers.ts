import { IScope2 } from "../Contexts";
import { IElementProcessor } from "./Index";

export class LinkProcessor implements IElementProcessor{
    analyze(element: HTMLElement): boolean {
        return false;
    }
    process(element: HTMLElement, context: IScope2): void {
        if (element.tagName != 'A'){
            return;
        }

        if (!element.getAttribute("href")){
            element.setAttribute("href", "#");
        }

        var name = element.getAttribute("name");
        var method=context.viewResult.component.findMethod(name ?? "noop");
        if (method){
            element.addEventListener('click', e=> {
                
            })
        }
    }
}

export class AttributePrefixModifier implements IElementProcessor {

    analyze(element: HTMLElement): boolean{
        for (let index = 0; index < element.attributes.length; index++) {
            const attribute = element.attributes[index];

            // format value as number.
            if (attribute.name[0] == '+') {
                return true;
            } else if (attribute.name[0] == ':') {
                return true;
            }
            else if (attribute.value.match(/[\+:][a-zA-Z_\-0-9]/)) {
                return true;
            }else{
                continue;
            }
        }

        return false;
    }

    process(element: HTMLElement, context: IScope2) {
        var methodBuilder = context.methodBuilder;
        let attributesToRemove: string[] = [];
        for (let index = 0; index < element.attributes.length; index++) {
            const attribute = element.attributes[index];


            // format value as number.
            if (attribute.name[0] == '+') {
                console.log('+' + attribute.name);
                attributesToRemove.push(attribute.name);
                //methodBuilder.appendLine(`if (context.data.${attribute.name.substring(1)}) {`);
                methodBuilder.appendLine(`${context.variableName}.setAttribute("${attribute.name.substring(1)}", +context.data.${attribute.value});`);
                //methodBuilder.appendLine('}');
            } else if (attribute.name[0] == ':') {
                console.log(':' + attribute.name);
                attributesToRemove.push(attribute.name);
                methodBuilder.appendLine(`${context.variableName}.setAttribute("${attribute.name.substring(1)}", +context.data.${attribute.value});`);
            }
            else if (attribute.value.match(/[\+:][a-zA-Z_\-0-9]/)) {
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
 * Looks for all attributes prefixed with 
 */
export class ButtonEventAnalyzer implements IElementProcessor {

    analyze(element: HTMLElement): boolean{
        return false;
    }

    process(element: HTMLElement, context: IScope2): void {
        const typeAttribute = element.getAttribute('type');
        const nameAttribute = element.getAttribute('name');

        var functionName = '';
        var eventName = '';
        if (element.tagName == 'button' && typeAttribute) {
            functionName = 'on' + typeAttribute?.substring(0, 1).toUpperCase() + typeAttribute.substring(1);
            eventName = 'click';
        }

        else if (element.tagName == 'input' && (typeAttribute == 'reset' || typeAttribute == 'submit')) {
            functionName = 'on' + typeAttribute?.substring(0, 1).toUpperCase() + typeAttribute.substring(1);
            eventName = 'click';
        }

        if (!nameAttribute) {
            if (functionName !== '') {
                this.bindEvent(context, eventName, functionName);
            }

            return;
        }

        if (element.tagName == 'button') {
            functionName = 'on' + nameAttribute.substring(0, 1).toUpperCase() + nameAttribute.substring(1);
            eventName = 'click';
        }


        else if (element.tagName == 'input' && typeAttribute == 'button') {
            functionName = 'on' + nameAttribute.substring(0, 1).toUpperCase() + nameAttribute.substring(1);
            eventName = 'click';
        }

        else if (element.tagName == 'input' || element.tagName == 'select' || element.tagName == 'textarea') {
            functionName = 'on' + nameAttribute.substring(0, 1).toUpperCase() + nameAttribute.substring(1);
            eventName = 'input';

        }

        this.bindEvent(context, eventName, functionName);

    }

    bindEvent(context: IScope2, eventName: string, functionName: string){
        var a = <any>context.viewResult.component.functions;
        if (!a.hasOwnProperty(functionName)){
            throw new Error(`Component does not have specified function. Can't bind event '${eventName}' to '${functionName}'.`)
            
        }

        context.methodBuilder.appendLine(`this.bindActions.push(() => ${context.variableName}.addEventListener('${eventName}', e => context.component['${functionName}'](e), { signal: this.controller.signal }));`);
    }

}