import { IComponent } from "../../../../src/Components/IComponent";
import { IComponentContext } from "../../../../src/Components/IComponentContext";
import { component } from "../../../../src/Components/Implementation/Decorator";

@component('MyComponent')
export class MyComponent implements IComponent {
    context: IComponentContext = null!;
    async initialize(): Promise<void> {
        this.context.signal.up('hello');
        this.context.signal.receive(x => this.onHello(x))
    }
    // async initialize(context: IComponentContext): Promise<void>{
    // }

    id: number = 0;

    async onHello(onHello: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

}