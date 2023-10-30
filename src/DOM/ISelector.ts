export interface ISelector{
    all(selector: string): HTMLElement[];
    one(idOrselector: string): HTMLElement;
}
