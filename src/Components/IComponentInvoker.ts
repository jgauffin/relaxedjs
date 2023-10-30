import { IViewTemplateItem } from "../Views/IViewTemplateItem";
import { IComponent } from "./IComponent";
import { IPage } from "./IPage";

export interface IInvokeContext{
    componentTagName: string; 
    templateFields?: IViewTemplateItem[];
    viewPath?: string;
    node: HTMLElement;
    page: IPage;
}

export interface IComponentInvoker{
    invokeChildComponent(context: IInvokeContext, parent?: IComponent): Promise<void>
}