import { IComponentInvoker } from "../Components/IComponentInvoker";
import { IView } from "./IView";

export interface IViewProvider{

    /**
     * Create a new view.
     * @param componentTag Tag that the component was registered with.
     * @param componentInvoker object used to invoke child components.
     */
    create(componentTag: string, componentInvoker: IComponentInvoker): IView;

    /**
     * Create a new view.
     * @param viewPath Segmented path of component names (to be able to render child components that are using custom templates). '/list-users/modal/edit-user'
     * @param componentInvoker object used to invoke child components.
     */
    createByViewPath(viewPath: string, componentInvoker: IComponentInvoker): IView;
}