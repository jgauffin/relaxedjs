import { IViewProvider } from "../Views/IViewProvider";
import { IComponentInvoker, IInvokeContext } from "../Components/IComponentInvoker";
import { IContainer, IContainerScope } from "../DependencyInjection/Container";
import { component, registrations } from "../Components/Implementation/Decorator";
import { IComponent } from "../Components/Exports";
import { IView } from "../Views/IView";
import { IViewTemplateItem } from "../Views/IViewTemplateItem";
import { IPage } from "../Components/IPage";
import { Router } from "../Routing/Implementation/Router";
import { hasInitialize } from "../Components/IInitialize";
import { hasCleanup } from "../Components/ICleanup";
import { IViewContext } from "../Views/IViewContext";
import { FormReader } from "../DOM/Utils/FormReader";

interface ILoadedPage {
    components: ILoadedComponent[];
    view?: IView
    instance: IPage;
    scope: IContainerScope,
}

interface ILoadedComponent {

    /**
     * All children (i.e. component markup existed in the view).
     */
    children: ILoadedComponent[];

    /**
     * Parent component (if any).
     */
    parent?: ILoadedComponent;

    /**
     * Page that this component was loaded for.
     * 
     * Required so that we can access scope etc.
     */
    page: ILoadedPage;

    /**
     * HTML tag name
     */
    componentTagName: string;

    /**
     * Created component.
     */
    instance: IComponent;

    /**
     * View that was created for the component.
     * 
     * Is a custom one if template fields are specified.
     */
    view?: IView;

    /**
     * Fields supplied in the parent view to customize the view of this component.
     */
    templateFields?: IViewTemplateItem[]

    /**
     * Virtual path to view (slash delimited path of hierarchical components).
     * 
     * Used to be able to distinquishe templated views, which are versions of the same view but with customized html).
     */
    viewPath?: string;
}

export class Engine2 implements IComponentInvoker {
    private componentToTagNameMap: Map<string, string> = new Map();
    private componentToWrapperMap: Map<IComponent, ILoadedComponent> = new Map();
    private pageToWrapperMap: Map<IPage, ILoadedPage> = new Map();
    private loadedPage?: ILoadedPage;

    constructor(private viewProvider: IViewProvider, private router: Router, private container: IContainer) {
        registrations.forEach(x => {
            if (x.tagName) {
                this.componentToTagNameMap.set(x.className, x.tagName)
            } else if (x.route) {
                //this.pageToRouteMap.set(x.className, x.route)
            }

        });
    }

    async invokeChildComponent(context: IInvokeContext, parent?: IComponent): Promise<void> {

        var pageWrapper = this.pageToWrapperMap.get(context.page);
        if (!pageWrapper) {
            throw new Error("Failed to find page for component " + context.componentTagName);
        }

        var scope = pageWrapper.scope!;
        var component = <IComponent>scope.resolve(context.componentTagName);

        var parentWrapper: ILoadedComponent | undefined;
        if (parent) {
            parentWrapper = this.componentToWrapperMap.get(parent);
            if (!parentWrapper) {
                throw new Error("Failed to find parent for " + context.componentTagName)
            }
        }

        var newComponentWrapper: ILoadedComponent = {
            children: [],
            parent: parentWrapper,
            page: pageWrapper,
            componentTagName: context.componentTagName,
            instance: component,
            templateFields: context.templateFields,
            viewPath: context.viewPath
        };

        this.componentToWrapperMap.set(component, newComponentWrapper);
        if (parentWrapper) {
            parentWrapper.children.push(newComponentWrapper);
        }
        else {
            pageWrapper.components.push(newComponentWrapper);
        }

        await this.executeComponent(newComponentWrapper, context.node);
    }

    async invokePage(targetNode: HTMLElement, url: string) {

        var oldPage = this.loadedPage;

        var routeResult = this.router.match(url);
        if (!routeResult) {
            throw new Error("Nothing has been routed to " + url);
        }


        var scope = this.container.createScope();

        var page = scope.resolve(routeResult.pageType);
        if (!page) {
            throw new Error(`Failed to resolve component ${routeResult.pageType}. Does it have the component decorator or been manually registered in the DI container?`);
        }

        var pageWrapper: ILoadedPage = {
            components: [],
            instance: page,
            scope: scope,
        };
        this.pageToWrapperMap.set(page, pageWrapper);

        page.context = {
            query: null,
            routeData: routeResult.routeData,
            signal: null!,
            readData: () => {
                throw new Error(`Page "${routeResult?.pageType.name}" cannot read data before being rendered.`);
            },
            redraw: async function () {
                throw new Error(`Page "${routeResult?.pageType.name}" cannot be redrawn before being rendered.`);
            },
            setTitle: function (title: string) {
                document.title = title;
            }
        }

        if (hasInitialize(page)) {
            await page.initialize();
        }

        var node = <HTMLElement>document.getElementById("relax");
        node.replaceChildren();


        const data = { ...routeResult.routeData, ...page };
        var viewContext: IViewContext = {
            engineItems: new Map<string, any>(),
            vm: page,
            data: data
        };

        var view = this.viewProvider.create(routeResult.pageType.name, this);
        pageWrapper.view = view;

        page.context.readData = () => {
            var formElement = targetNode.querySelector('form');
            var reader = new FormReader();
            var data = reader.read(<HTMLElement>formElement)
            page['data'] = data;
        };
        page.context.redraw = async function () {
            await view.render(targetNode, viewContext)
        };

        await view.render(node, viewContext);

        if (oldPage) {
            this.disposePage(oldPage!);
        }

        this.loadedPage = pageWrapper;
    }

    private async disposePage(page: ILoadedPage) {
        // Go from leaf nodes and inwards to let them
        // cleanup through the dependency chain.
        for (let index = 0; index < page.components.length; index++) {
            const child = page.components[index];
            this.disposeComponent(child);
        }

        if (hasCleanup(page)) {
            await page.cleanup();
        }

        page.scope.release();
    }

    private async disposeComponent(component: ILoadedComponent) {

        // Go from leaf nodes and inwards to let them
        // cleanup through the dependency chain.
        for (let index = 0; index < component.children.length; index++) {
            const child = component.children[index];
            this.disposeComponent(child);
        }

        if (hasCleanup(component)) {
            await component.cleanup();
        }
    }

    private async executeComponent(wrapper: ILoadedComponent, element: HTMLElement) {

        if (!wrapper.view) {
            if (wrapper.templateFields != null && wrapper.templateFields.length > 0) {
                wrapper.view = this.viewProvider.createByViewPath(wrapper.viewPath!, this);
            }
            else {
                wrapper.view = this.viewProvider.create(wrapper.componentTagName, this);
            }
        }

        wrapper.instance.context = {
            params: new Map(),
            redraw() {
                throw new Error('You cannot call redraw() before component have been initialized. Component: ' + wrapper.componentTagName);
            },
            signal: {
                up<TSignal>(signal: TSignal): Promise<void> {
                    return Promise.resolve();
                },
                down<TSignal>(signal: TSignal): Promise<void> {
                    return Promise.resolve();
                },
                receive<T>(callback: (signal: T) => Promise<void>): void {
                }
            },
            readData(): void {
                throw new Error('You cannot call readData() before component have been initialized. Component: ' + wrapper.componentTagName);
            }
        };

        if (hasInitialize(component)) {
            await component.initialize();
        }

        var viewContext: IViewContext = {
            engineItems: new Map<string, any>(),
            vm: wrapper.instance,
            data: {}
        };

        wrapper.instance.context.redraw = () => {
            wrapper.view!.render(element, viewContext);
        };

        wrapper.instance.context.readData = () => {
            var formElement = element.querySelector('form');
            var reader = new FormReader();
            var data = reader.read(<HTMLElement>formElement)
            wrapper.instance = data;

        };

        wrapper.view!.bindToComponent(wrapper.instance);
        wrapper.view!.render(element, viewContext);
    }

}