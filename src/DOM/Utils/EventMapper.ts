import { Selector } from "./Selector";

export class EventMapper {
    private scope: any;
    private selector: Selector;

    constructor(scope?: HTMLElement, attributePrefix: string = 'yo') {
        if (typeof scope === "undefined") {
            this.scope = document;
        } else {
            this.scope = scope;
        }

        this.selector = new Selector(this.scope, attributePrefix)
    }

    click(selector: string, listener: (ev: MouseEvent) => any, useCapture?: boolean): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(`Failed to bind "click" to selector "${selector}", no elements found.`);

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("click", listener, useCapture);

        }
    }

    change(selector: string, listener: (ev: Event) => any, useCapture?: boolean): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(`Failed to bind "change" to selector "${selector}", no elements found.`);
        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("change", listener, useCapture);
        }
    }

    keyUp(selector: string, listener: (ev: KeyboardEvent) => any, useCapture?: boolean): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(`Failed to bind "keyup" to selector "${selector}", no elements found.`);

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("keyup", listener, useCapture);
        }
    }

    keyDown(selector: string, listener: (ev: KeyboardEvent) => any, useCapture?: boolean): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(`Failed to bind "keydown" to selector "${selector}", no elements found.`);

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("keydown", listener, useCapture);
        }
    }
}