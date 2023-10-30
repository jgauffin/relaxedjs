import { IComponent } from "../Components/IComponent";
import { IComponentInvoker } from "../Components/IComponentInvoker";
import { IPage } from "../Components/IPage";
import { IView } from "./IView";
import { IViewContext } from "./IViewContext";
import { IViewTemplateItem } from "./IViewTemplateItem";

export abstract class ViewBase implements IView{
    bindActions: Function[]=[];
    constructor(private engine: IComponentInvoker, private component: IComponent, private page: IPage){

    }

    bindToComponent(): void {
        this.bindActions.forEach(x=>x());
    }

    abstract render(parent: Node, context: IViewContext) : Promise<void>;

    invokeChild(node: HTMLElement, componentName: string, templateItems?: IViewTemplateItem[]){
        var context = {
            componentTagName: componentName,
            arguments: [],
            node: node,
            templateItems: templateItems,
            page: this.page
        };
        this.engine.invokeChildComponent(context, this.component);
    }

    protected elem(parent: Node, tagName: string): HTMLElement{
        var e = document.createElement(tagName);
        parent.appendChild(e);
        return e;
    }

    protected text(parent: Node, text: string){
        var t = document.createTextNode(text);
        parent.appendChild(t);
        return t;
    }
}