import { IComponentMeta } from "../Services/MetaGenerator";
import { AttributePrefixModifier } from "./Analyzers/AttributeAnalyzers";
import { ElseAttibute as ElseAttribute, IfAttribute, UnlessAttribute } from "./Preprocessors/ControlAttributes";
import { HandleBarsInvoker } from "./Analyzers/TextAnalyzers";
import { GeneratedViewClass, IRequestedViewBuild, IScope2, Scope2 } from "./Contexts";
import { StringBuilder } from "../Utils/StringBuilder";
import { ForModifier } from "./Preprocessors/ForPreProcessor";
import { IElementPreProcessor, Result } from "./Preprocessors/Index";
import { CustomTagPreProcessor } from "./Preprocessors/CustomTagPreProcessor";
import { IElementProcessor, ITextNodeProcessor } from "./Analyzers/Index";
import { FormSubmitAnalyzer } from "./Analyzers/FormSubmitAnalyzer";


// class AnalyzedNode{
//     constructor (public node: Node, public hasLogic: boolean){

//     }

//     children: AnalyzedNode[] = [];
//     hasLogicalChildren() :boolean{
//         for (let index = 0; index < this.children.length; index++) {
//             const child = this.children[index];
//             if (child.hasLogic){
//                 return true;
//             }
//         }

//         return false;
//     }
// }

export interface IViewBuilder {

}

export interface IGenerationResult {

    /**
     * Generated TS for the view.
     */
    contents: string;

    /**
     * Child views that uses template items.
     */
    requests: IRequestedViewBuild[]
}

/**
 * Takes HTML for a specific view and converts it to an ES6 class which can be invoked to generate the correct view HTML.
 */
export class ViewBuilder {
    private preProcessors: IElementPreProcessor[] = [];
    private textAnalyzers: ITextNodeProcessor[] = [];
    private elementAnalyzers: IElementProcessor[] = [];

    constructor(private meta: IComponentMeta) {
        this.preProcessors.push(new IfAttribute());
        this.preProcessors.push(new UnlessAttribute());
        this.preProcessors.push(new ElseAttribute());
        this.preProcessors.push(new ForModifier());
        this.preProcessors.push(new CustomTagPreProcessor())

        this.elementAnalyzers.push(new AttributePrefixModifier());
        this.elementAnalyzers.push(new FormSubmitAnalyzer());

        this.textAnalyzers.push(new HandleBarsInvoker());
    }

    /**
     * 
     * @param viewName Name of the view to generate
     * @param node HTML node that the view should be generated from.
     * @returns The main view and all child views that contains customized html (used @see IViewTemplateItem). The main view is always first in the list.
     */
    process(viewName: string, node: Node): IGenerationResult {


        var vr = new GeneratedViewClass(this.meta);
        var sb = new StringBuilder(8);
        var context = new Scope2('div', (e, c) => this.processChildElement(e, c), vr, new Map(), '', 'root', sb);
        this.processChildElement(<HTMLElement>node, context);

        var contents = this.generateClass(viewName, context, vr.methods);
        return {
            contents: contents,
            requests: context.queuedViewBuilds
        };
    }


    // private analyze(node: Node, context: AnalyzedNode){

    //     if (node.nodeType == Node.ELEMENT_NODE){

    //     }else if (node.nodeType == Node.TEXT_NODE){
    //         var processed = false;
    //         for (let index = 0; index < this.textAnalyzers.length; index++) {
    //             const analyzer = this.textAnalyzers[index];
    //             if (analyzer.analyze(node)){
    //                 context.children.push(new AnalyzedNode(node, true))
    //                 processed=true;
    //                 break;
    //             }
    //         }
    //     }



    // }
    private generateClass(className: string, context: IScope2, methods: StringBuilder[]): string {
        var sb = new StringBuilder();
        sb.appendLine(`export class ${className} extends ViewBase`);
        sb.appendLineIndent('{');
        sb.appendLine('render(root, context)');
        sb.appendLineIndent('{');
        sb.appendBuilder(context.methodBuilder);
        sb.dedentAppendLine('}');
        sb.appendLine();
        methods.forEach(x => {
            sb.appendBuilder(x);
        })

        // context.helperMethods.forEach(key => {
        //     var method = context.helperMethods.get(key);
        //     sb.appendLine(method);
        // })

        sb.dedentAppendLine('}');

        return sb.toString();
    }

    private isEmptyNode(node: Node): boolean {
        return node.nodeType == Node.TEXT_NODE && (!node.textContent || node.textContent.trim() == '');
    }

    private processChildElement(node: Node, parentContext: IScope2, newScope?: boolean): boolean {
        if (node.nodeType == Node.ELEMENT_NODE) {
            var e = <HTMLElement>node;
            if (newScope !== false) {
                var childContext = parentContext.createContext(e.tagName);
                return this.processElement(e, childContext);
            }

            return this.processElement(e, parentContext);
        } else {
            return this.processTextNode(node, parentContext);
        }
    }

    /**
     * 
     * @param element element to parse.
     * @param methodName Name of this method.
     * @param sb StringBuilder to add the method to.
     */
    processElement(element: HTMLElement, context: IScope2): boolean {
        var nodeGotLogic = false;
        //console.log('scope', context);

        var stop = false;
        this.preProcessors.forEach(controller => {
            var result = controller.process(element, context);
            nodeGotLogic = nodeGotLogic || result !== Result.NotProcessed;
            if (result == Result.StopProcessing) {
                console.log('stopping for ', element.tagName);
                stop = true;
                return;
            }
        });

        if (stop) {
            console.log('STOP', element.outerHTML);
            return nodeGotLogic;
        }

        context.methodBuilder.appendLine(`const ${context.variableName} = this.elem(${context.parentVariableName}, "${element.tagName}");`);
        this.elementAnalyzers.forEach(controller => {
            controller.process(element, context);
        });

        for (let index = 0; index < element.attributes.length; index++) {
            const attr = element.attributes[index];
            context.methodBuilder.appendLine(`${context.variableName}.setAttribute('${attr.name}', '${attr.value});`);
        }

        if (element.childNodes.length == 0) {
            return nodeGotLogic;
        }

        if (element.childNodes.length > 1) {
            context.methodBuilder.indent();
        }

        for (let index = 0; index < element.childNodes.length; index++) {
            const node = element.childNodes[index];
            if (this.isEmptyNode(node)) {
                continue;
            }

            nodeGotLogic = this.processChildElement(node, context);
        }

        if (element.childNodes.length > 1) {
            context.methodBuilder.dedent();
        }

        return nodeGotLogic;
    }

    processTextNode(node: Node, context: IScope2): boolean {

        var processed = false;
        this.textAnalyzers.forEach(controller => {
            processed = controller.process(node, context) || processed;
        });

        if (!processed) {
            if (node.parentElement?.childNodes.length == 1) {
                context.methodBuilder.appendLine(`${context.variableName}.innerText = ' ${node.textContent?.trim()} 4';`);
            } else {
                context.methodBuilder.appendLine(`text(${context.variableName}, ' ${node.textContent?.trim()} 3');`);
            }
        }

        return false;
    }
}