import { InitLock } from "../../Utils/Locks";
import { IComponentMeta } from "./ComponentMeta";
import { IComponentMetaProvider } from "./IComponentMetaProvider";

export class ComponentMetaProvider implements IComponentMetaProvider {

    async get(tagName: string): Promise<IComponentMeta> {
        if (this.index.size == 0) {
            await this.initLock.wait();
        }

        var url = this.index.get(tagName);
        if (!url) {
            throw new Error(`No view is registered for '${tagName}'.`);
        }

        return url;
    }

    private index: Map<string, IComponentMeta> = new Map();
    private initLock = new InitLock();

    constructor() {
        this.load().then(() => {
            this.initLock.release();
        });
    }

    private async load(): Promise<void> {
        var response = await fetch('/componentIndex.json');
        if (!response.ok) {
            throw new Error("Failed to load component index from backend.");
        }

        var json = await response.text();
        var items = JSON.parse(json.toString());

        items.forEach((x: IComponentMeta) => {
            if (x.tagName){
                this.index.set(x.tagName, x);
            }
            
        });
    }

}