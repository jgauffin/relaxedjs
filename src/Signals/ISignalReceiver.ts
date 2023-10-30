import { Constructor } from "../Utils/Type";

export interface ISignalReceiver<TSignal>{
    onSignal(signal: TSignal): void;
}

export interface IWire {
    up<TSignal>(signal: TSignal): Promise<void>;
    down<TSignal>(signal: TSignal): Promise<void>;
    receive<T>(callback: (signal: T) => Promise<void>): void;
}

export class ButtonSignal{
    constructor(formName: string, public actionName: string){

    }
}

export class ActionSignal{
    constructor(public actionName: string){

    }
}

export class ActionSignalWithData<TData>{
    constructor(public actionName: string, public data: TData){

    }
}

interface IMappedSignal{
    signalType: Constructor;
    callback: (signal: any) => Promise<void>
}

export class Wire implements IWire {
    mappedSignals: IMappedSignal[] = [];
    children: IWire[] = [];

    constructor(private parent: Wire){

    }

    appendChild(wire: IWire){
        this.children.push(wire);
    }

    async up<TSignal>(signal: TSignal): Promise<void> {
        for (let index = 0; index < this.parent.mappedSignals.length; index++) {
            const mappedSignal = this.mappedSignals[index];
            if (mappedSignal.signalType == (<any>signal).constructor.name){
                await mappedSignal.callback(signal);
            }
        }
    }

    down<TSignal>(signal: TSignal): Promise<void> {
        throw new Error("Method not implemented.");
    }
    receive<T>(callback: (signal: T) => Promise<void>): void {
        throw new Error("Method not implemented.");
    }
}