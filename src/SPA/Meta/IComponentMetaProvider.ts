import { IComponentMeta } from "./ComponentMeta";

export interface IComponentMetaProvider{
    get(tagName: string): Promise<IComponentMeta>;
}

