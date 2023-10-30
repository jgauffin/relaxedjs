import { IViewContext } from "./IViewContext";

export interface IView{
    bindToComponent(component: any): void;
    render(parent: Node, context: IViewContext) : Promise<void>
}