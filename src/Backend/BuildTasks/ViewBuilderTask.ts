import { promises as fs } from 'fs'
import { IAnalyzerContext, IComponentAnalyzer } from '../compiler';
import { IComponentMeta } from '../Services/MetaGenerator';
import { existsSync } from 'fs';
import { ViewBuilder } from '../Views/ViewBuilder';
import * as dom from "@xmldom/xmldom";
import { IRequestedViewBuild } from '../Views/Contexts';

/**
 * Index views and map them to the correct components.
 */

export interface IViewIndexer {
    getViewUrl(componentName: string): Promise<string>;
}


interface IViewIndexEntry {

    /**
     * Used to identify the component.
     */
    tagName?: string;

    /**
     * Class name of the component that this view belongs to.
     */
    className: string;

    /**
     * Relative path and file name.
     * 
     * Ends with a delimiter (slash/backslash depending on OS).
     */
    relativeViewPath?: string;

    /**
     * Name of view (filename with extension).
     */
    viewFileName?: string;
}

async function mapClassToView(declaration: IComponentMeta): Promise<IViewIndexEntry | null> {

    var fullPath = `${declaration.directory}${declaration.fileName}`;
    var htmlPath = fullPath.replace('.ts', '.html');

    if (!existsSync(htmlPath)) {
        return {
            className: declaration.className,
            tagName: declaration.tagName,
        };

    }

    var result: IViewIndexEntry = {
        className: declaration.className,
        tagName: declaration.tagName,
        relativeViewPath: htmlPath,
        viewFileName: declaration.fileName
    }
    console.log('view index result', result);
    return result;
}

var registeredMappings: IViewIndexEntry[] = [];

/**
 * View compiler tagsk.
 * 
 * This task is responsible of compiling the HTML views into ES6 classes, which later
 * are bundled and supplied with the web site. The goal is to also generate source maps
 * for the generated file. * 
 */
export class ViewBuilderTask implements IComponentAnalyzer {

    /**
     * Analyze all pages/components, find their corresponding view and generate view classes.
     * @param context 
     */
    async analyze(context: IAnalyzerContext): Promise<void> {
        const registeredMappings = await this.generateIndex(context);

        for (var i = 0; i < registeredMappings.length; ++i) {
            var index = registeredMappings[i];

            var component = context.components.find(x => x.className == index.className);
            if (component) {
                console.log('analyzing ', component);
                await this.analyzeComponent(context, component, index);
            }
            else{
                context.addError(`Failed to match tag ${index.className} with a component.`, "components");
            }
        }

        const json = JSON.stringify(registeredMappings);
        console.log('registered view mappings ', json);
        await fs.writeFile(context.outputDirectory + 'viewIndex.json', json);
    }

    /**
     * Generate an index of all views where the key is the component name (as defined in the page/component tag).
     * @param context Analyzer context.
     * @returns An @see IViewIndexEntry array
     */
    private async generateIndex(context: IAnalyzerContext): Promise<IViewIndexEntry[]> {
        registeredMappings = [];
        for (const component of context.components) {
            const mapping = await mapClassToView(component);
            if (mapping == null) {
                continue;
            }

            const existingMapping = registeredMappings.find(x => x.tagName == mapping.tagName);
            if (existingMapping) {
                context.addError(`"${mapping.tagName}" has already been mapped for "${existingMapping.className}", cannot be mapped to ${mapping.className}.`, 'views');
            } else {
                registeredMappings.push(mapping);
            }
        }

        return registeredMappings;
    }


    /**
     * 
     * @param context Analyzes a component and its view field to be able to generate a view class.
     * @param componentMeta 
     * @param viewMeta 
     * @returns 
     */
    private async analyzeComponent(context: IAnalyzerContext, componentMeta: IComponentMeta, viewMeta: IViewIndexEntry) {
        var viewBuilder = new ViewBuilder(componentMeta);
        var html = await fs.readFile(viewMeta.relativeViewPath!);

        let element: Element;

        var el2 = this.invokeParser(html.toString(), componentMeta.className, viewMeta.relativeViewPath!, (msg, cat) => context.addError(msg, cat));
        if (!el2) {
            context.addError(`Failed to parse ${viewMeta.relativeViewPath}`, "views");
            return;
        }
        element = el2;

        console.log('processing', element);
        var result = viewBuilder.process(viewMeta.viewFileName!, element);
        var classFileName = viewMeta.viewFileName?.replace('html', 'js');
        fs.writeFile(context.outputDirectory + viewMeta.relativeViewPath + classFileName, result.contents);
        console.log('writing ', result.contents);

        for (let index = 0; index < result.requests.length; index++) {
            const request = result.requests[index];
            await this.generateChildClass(context, request);
        }
    }


    /**
     * Generate a view for a component (child to either a page or another component).
     * @param context 
     * @param request 
     * @returns 
     */
    private async generateChildClass(context: IAnalyzerContext, request: IRequestedViewBuild): Promise<void> {
        const mapping = registeredMappings.find(x => x.tagName == request.tagName);
        if (mapping == undefined) {
            context.addError(`Failed to find child view ${request.tagName}`, "views");
            return;
        }

        const component = context.components.find(x => x.className == mapping.className);
        if (component == undefined) {
            context.addError(`Failed to find component ${mapping.className} requested via path ${request.childViewPath}`, "views");
            return;
        }

        var viewBuilder = new ViewBuilder(component);
        var html = await fs.readFile(mapping.relativeViewPath!);
        let element: Element = new HTMLElement();

        context.addError('version2', "views");
        var el2 = this.invokeParser(html.toString(), component.className, request.childViewPath, context.addError)
        if (!el2) {
            return;
        }
        element = el2;


        request.templateItems.forEach(item => {

            var found = false;
            for (let index = 0; index < element.children.length; index++) {
                const childElement = element.children[index];
                if (childElement.getAttribute("name") == item.name) {
                    found = true;
                    childElement.removeAttribute("name");
                    childElement.innerHTML = item.html;
                }

                if (childElement.tagName.toUpperCase() == item.name.toUpperCase()) {
                    found = true;
                    childElement.innerHTML = item.html;
                }
            }

            if (!found) {
                context.addError(`Failed to find template item '${item.name}' in template '${request.tagName}'.`, "views");
            }
        });


        var result = viewBuilder.process(mapping.viewFileName!, element);
        var classFileName = mapping.viewFileName?.replace('html', 'js');

        if (request.childViewPath) {
            console.log(`Rendering ${request.childViewPath}...`);
        }
        else {
            fs.writeFile(context.outputDirectory + mapping.relativeViewPath + classFileName, result.contents);
        }


        for (let index = 0; index < result.requests.length; index++) {
            const request = result.requests[index];
            await this.generateChildClass(context, request);
        }
    }

    private invokeParser(html: string, className: string, viewPath: string, addError: (message: string, category: 'views' | 'components' | 'routing') => void): Element | null {
        var element: Element | null = null;

        try {
            const parser = new dom.DOMParser({
                /**
                 * locator is always need for error position info
                 */
                locator: {},
                /**
                 * you can override the errorHandler for xml parser
                 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
                 */
                errorHandler: {
                    warning: function (errMsg: string) { var msg = `error: Component ${className}: ${errMsg}`; addError(msg, "views"); console.log('ERRRRRRRO ', errMsg) },
                    error: function (errMsg: string) { var msg = `error: Component ${className}: ${errMsg}`; addError(msg, "views"); console.log('ERRRRRRRO ', errMsg) },
                    fatalError: function (errMsg: string) { var msg = `fatal: Component ${className}: ${errMsg}`; addError(msg, "views");  console.log('ERRRRRRRO ', errMsg) }
                }
                //only callback model
                //errorHandler:function(level,msg){console.log(level,msg)}
            })

            const htmlDoc = parser.parseFromString(`<html><body>${html.toString()}</body></html>`, 'text/html');

            // ugly, yes. But it's the only combination that I could get to work.
            element = <HTMLElement>htmlDoc.documentElement.firstChild!.firstChild!;
            if (!element) {
                addError(`Failed to find root element for view ${viewPath}. Found ` + htmlDoc.body.outerHTML, "views");
            }
        }
        catch (e) {
            console.log('MOOOOOOOOOOOOT', e);
            addError(`Failed to parse HTML for '${viewPath}': ${e}`, "views");
        }

        return element;

    }

    // private asNode(node: Node | null): string{

    //     if (!node){
    //         return 'NULL';
    //     }

    //     var str = node.nodeName + '## VALUE';
    //     if (node.nodeType == Node.ELEMENT_NODE){
    //         return str += (<HTMLElement>node);
    //     }
    //     else{
    //         return str += 'TEXT ' + node.textContent ?? "";
    //     }
    // }
}
