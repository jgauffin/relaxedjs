/**
 * Template node.
 * 
 * Templates can be used When invoking one component from another. Their purpose is to be able to define HTML templates that will replace some of the child components HTML. For instance to display custom HTML in a modal component.
 */
export interface IViewTemplateItem {
    /**
     * Name of the part in the child component that should be replaced/filled.
     */
    name: string;

    /**
     * Inner HTML to use.
     */
    html: string
}