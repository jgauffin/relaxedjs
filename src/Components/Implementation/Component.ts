import { IComponent, IComponentContext } from "../Exports";
import { EmptyContext } from "./EmptyContext";

export abstract class Component implements IComponent{
    context: IComponentContext = new EmptyContext();
    abstract initialize(): Promise<void>;
}