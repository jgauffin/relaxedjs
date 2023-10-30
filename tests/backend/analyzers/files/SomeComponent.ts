import {Component, component} from "../../../../src/components/Exports";

@component('NoHtml')
export class SomeComponent extends Component{
    initialize(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}