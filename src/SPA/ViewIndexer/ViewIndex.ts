import { InitLock } from '../../Utils/Locks';

export interface IViewIndex {
    getViewUrl(componentName: string): Promise<string>;
}


interface IViewIndexEntry {
    tagName: string;
    className: string;
    viewPath?: string;
}

/**
 * Uses component tags to find the correct view (and its path).
 */
export class ViewIndex implements IViewIndex {
    private index: Map<string, string> = new Map();
    private initLock = new InitLock();

    constructor() {
        this.load().then(() => {
            this.initLock.release();
        });
    }

    async getViewUrl(tagName: string): Promise<string> {
        if (this.index.size == 0) {
            await this.initLock.wait();
        }

        var url = this.index.get(tagName);
        if (!url) {
            throw new Error(`No view is registered for '${tagName}'.`);
        }

        return url;
    }

    private async load(): Promise<void> {
        var response = await fetch('/viewIndex.json');
        if (!response.ok){
            throw new Error("Failed to load view index from backend.");
        }

        var json = await response.text();
        var items = JSON.parse(json.toString());

        items.forEach((x: IViewIndexEntry) => {
            if (x.viewPath) {
                this.index.set(x.tagName, x.viewPath);
            }
        });
    }

}