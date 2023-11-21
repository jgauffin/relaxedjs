import { registrations } from "../../../Components/Implementation/Decorator";
import { IViewTemplateItem } from "../../../browser";
import { IViewBuilderProcessorContext } from "../Contexts";
import { IElementPreProcessor, Result } from "./Index";



export class CustomTagPreProcessor implements IElementPreProcessor {
    constructor() {
        registrations.forEach(x => {
            x.tagName
        });
    }

    analyze(element: HTMLElement): boolean {
        return registrations.findIndex(x => x.tagName == element.tagName) !== -1;
    }

    process(element: HTMLElement, context: IViewBuilderProcessorContext): Result {
        console.log('Looking for ' + element.tagName);
        var reg = registrations.find(x => x.tagName!.localeCompare(element.tagName, 'en', { sensitivity: "accent" }) == 0);
        if (!reg) {
            return Result.NotProcessed;
        }

        console.log('FOUND IT!');

        if (element.children.length > 0) {

            var templateItems:  IViewTemplateItem[] = [];
            context.methodBuilder.appendLineIndent('var templates = [');
            for (let index = 0; index < element.children.length; index++) {
                const child = element.children[index];
                if (child.hasAttribute('name')) {
                    context.methodBuilder.appendLine(`{ name: ${child.getAttribute('name')}, html: \`${child.innerHTML}\` },`);
                    templateItems.push({name: child.getAttribute("name")!, html: child.innerHTML});
                } else {
                    context.methodBuilder.appendLine(`{ name: ${child.tagName}, html: \`${child.innerHTML}\` },`);
                    templateItems.push({name: child.tagName, html: child.innerHTML});
                }

            }
            context.methodBuilder.dedentAppendLine('];');

            var childViewPath = `${context.viewPath}${element.tagName}`;
            context.methodBuilder.appendLine(`this.invokeComponent(${context.variableName}, '${reg.tagName}', '${childViewPath}', templates);`)
            context.queueViewBuild(element.tagName, childViewPath, templateItems);
        }
        else {
            context.methodBuilder.appendLine(`this.invokeComponent(${context.variableName}, '${reg.tagName}');`)
        }


        return Result.StopProcessing;
    }
}
