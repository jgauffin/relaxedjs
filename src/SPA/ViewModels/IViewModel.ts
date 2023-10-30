import { IActivationContext } from "./IActivationContext";

  /**
 * A view model (controlling what is presented in a view and also acts on events)
 */
   export interface IViewModel<TData> {
    data: TData;

    /**
     * Document title
     * Will be invoked after activate as been run
     */
    getTitle(): string;

    init(): Promise<void>;

}


export interface IViewModelActivation{
    /**
     * This viewModel just became active.
     */
     activate(context: IActivationContext): Promise<void>;
}

export interface IViewModelDeactivation{

    /**
     * User is navigating away from this view model.
     */
     deactivate(): Promise<void>;
}

export interface IPage
{
  
}