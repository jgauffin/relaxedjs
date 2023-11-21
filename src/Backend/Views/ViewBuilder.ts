import { IComponentMeta } from "../Services/MetaGenerator";
import { AttributePrefixModifier } from "./Analyzers/AttributeAnalyzers";
import { ElseAttibute as ElseAttribute, IfAttribute, UnlessAttribute } from "./Preprocessors/ControlAttributes";
import { HandleBarsInvoker } from "./Analyzers/TextAnalyzers";
import { GeneratedViewClass, IRequestedViewBuild, IViewBuilderProcessorContext, Scope2 } from "./Contexts";
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
    private counter = 0;

    constructor(private meta: IComponentMeta, preProcessors?: IElementPreProcessor[], textProcessors?: ITextNodeProcessor[], elementAnalyzers?: IElementProcessor[]) {
        if (preProcessors) {
            this.preProcessors = preProcessors;
        }
        else {
            this.preProcessors.push(new IfAttribute());
            this.preProcessors.push(new UnlessAttribute());
            this.preProcessors.push(new ElseAttribute());
            this.preProcessors.push(new ForModifier());
            this.preProcessors.push(new CustomTagPreProcessor())
        }

        if (textProcessors) {
            this.textAnalyzers = textProcessors;
        }
        else {
            this.textAnalyzers.push(new HandleBarsInvoker());
        }

        if (elementAnalyzers) {
            this.elementAnalyzers = elementAnalyzers;
        } else {
            this.elementAnalyzers.push(new AttributePrefixModifier());
            this.elementAnalyzers.push(new FormSubmitAnalyzer());
        }
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
        var context = new Scope2('div', (e, c) => {
            this.processChildElement(e, c);
        }, vr, new Map(), '', 'root', sb);
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
    private generateClass(className: string, context: IViewBuilderProcessorContext, methods: StringBuilder[]): string {
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

    /**
     * Check if node (non HTML Element) is empty.
     * @param node node to check
     * @returns true if it's a text node which is empty or contain only white spaces.
     */
    private isEmptyNode(node: Node): boolean {
        return node.nodeType == Node.TEXT_NODE && (!node.textContent || node.textContent.trim() == '');
    }

    private processChildElement(node: Node, parentContext: IViewBuilderProcessorContext, newScope?: boolean): boolean {
        if (this.counter > 30) {
            throw new Error("Too much");
        }
        this.counter++;

        if (node.nodeType == Node.ELEMENT_NODE) {
            var e = <HTMLElement>node;
            if (newScope !== false) {
                console.log('doing elem1', e);
                var childContext = parentContext.createContext(e.tagName);
                return this.processElement(e, childContext);
            }

            console.log('doing elem2', e);
            return this.processElement(e, parentContext);
        } else {
            console.log('doing node', node);
            return this.processTextNode(node, parentContext);
        }
    }

    /**
     * 
     * @param element element to parse.
     * @param methodName Name of this method.
     * @param sb StringBuilder to add the method to.
     * @returns true if the node has some kind of logic, which means that the tag cannot be added as plain text.
     */
    processElement(element: HTMLElement, context: IViewBuilderProcessorContext): boolean {

        // Nodes with logic cannot be written
        // as plain HTML nodes directly, we need to take
        // into account tha the view class will reauire 
        // logic for it (if/else/for etc).
        var nodeGotLogic = false;

        var stop = false;
        this.preProcessors.every(controller => {

            // this node cannot process it,
            // but we shouldn't prevent others.
            if (!controller.analyze(element)) {
                return true;
            }

            var result = controller.process(element, context);
            nodeGotLogic = nodeGotLogic || result !== Result.NotProcessed;
            if (result == Result.StopProcessing) {
                stop = true;
                return false;
            }

            return true;
        });

        if (stop) {
            return nodeGotLogic;
        }

        context.methodBuilder.appendLine(`const ${context.variableName} = this.elem(${context.parentVariableName}, "${element.tagName}");`);
        this.elementAnalyzers.forEach(controller => {
            controller.process(element, context);
        });

        // Attributes left here is only the ones that the analyzers didnt process/remove,
        // which means that they are pure HTML.
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

    processTextNode(node: Node, context: IViewBuilderProcessorContext): boolean {

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


    // // Left here for debugging purposes, but commented out since lint will warn otherwise. 
    // private nodeToString(node: Node | null): string {

    //     if (!node) {
    //         return 'NULL';
    //     }

    //     var str = node.nodeName + '## VALUE';
    //     if (node.nodeType == Node.ELEMENT_NODE) {
    //         return str += (<HTMLElement>node);
    //     }
    //     else {
    //         return str += 'TEXT ' + node.textContent ?? "";
    //     }
    // }
}