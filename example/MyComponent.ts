import { component } from "../components/implementations/Decorator";
import { IComponent } from "../components/interfaces/IComponent";
import { IComponentContext } from "../components/interfaces/IComponentContext";



/**
 * 
 * <div :id>
 *   <input type="text" name="userName">
 * 
 * 
 * 
 */

@component('mytag')//, '/users/+id/'
export class MyComponent implements IComponent{
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