import { IViewBuilderProcessorContext } from "../Contexts";
import { ITextNodeProcessor } from "./Index";

export class HandleBarsInvoker implements ITextNodeProcessor {
    analyze(node: Node): boolean {
        return node.textContent != null && node.textContent.indexOf('{{') >= 0;
    }

    process(node: Node, context: IViewBuilderProcessorContext): boolean {
        if (!node.textContent || node.textContent.indexOf('{{') === -1) {
            return false;
        }

        var re = /\{\{(.*?)\}\}/g;
        var matches = node.textContent.split(re);

        let str = '';
        if (matches.length == 3 && matches[0] == '' && matches[2] == '') {
            str = matches[1];
        }
        else {
            str = "`";
            for (let index = 0; index < matches.length; index++) {
                const item = matches[index];
                if ((index % 2) == 0) {
                    str += item;
                } else {
                    str += "${context.data." + item + "}";
                }
            }
            str += "`";
        }

        if (node.parentElement?.childNodes.length == 1) {
            context.methodBuilder.appendLine(`${context.variableName}.innerText = ${str};`);
        } else {
            context.methodBuilder.appendLine(`this.text(${context.variableName}, ${str});`);
        }

        return true;
    }

    // private interpolate(str: string) {
    //     return function interpolate(o) {
    //         return str.replace(/{([^{}]*)}/g, function (a, b) {
    //             var r = o[b];
    //             return typeof r === 'string' || typeof r === 'number' ? r : a;
    //         });
    //     }
    // }

    // private template(content: string, values: any) {
    //     return content.replace(/{{(.+?)}}/g, function (_, prop) {
    //         return prop.split('.').reduce(function (obj: any, key: string) {
    //             return obj[key];
    //         }, values);
    //     });
    // }
}
