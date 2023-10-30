import { IWire } from "../../Signals/ISignalReceiver";
import { IComponentContext } from "../Exports";

export class EmptyContext implements IComponentContext{
    static Instance: EmptyContext = new EmptyContext();
    
    readData(): void {
        throw new Error("Method not implemented.");
    }
    routeData: any = null;
    params: Map<string, any> = new Map();

    redraw(): void {
        throw new Error("Cannot call redraw() before component being initialized.");
    }
    signal: IWire = {
        up<TSignal>(signal: TSignal): Promise<void>{
            return Promise.resolve();
        },
        down<TSignal>(signal: TSignal): Promise<void>{
            return Promise.resolve();
        },
        receive<T>(callback: (signal: T) => Promise<void>): void{
        }
    };
}