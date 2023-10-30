import {Component, component} from "../../../../../src/components/Exports";

@component('NoHtml')
export class ComponentWithoutHtml extends Component{
    initialize(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}