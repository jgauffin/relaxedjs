/**
 * Abstraction layer between actual DOM and this library.
 * 
 * This is in no way intented to be a complete abstraction. It should only
 * contain what this library required to be able to work with the DOM
 * and to easily mock it in unit tests.
 */

export interface IEventMapper{
    click(selector: string, listener: (ev: MouseEvent) => any, useCapture?: boolean): void;
    change(selector: string, listener: (ev: Event) => any, useCapture?: boolean): void;
    keyUp(selector: string, listener: (ev: KeyboardEvent) => any, useCapture?: boolean): void;
    keyDown(selector: string, listener: (ev: KeyboardEvent) => any, useCapture?: boolean): void;
}