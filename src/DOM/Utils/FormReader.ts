import { assignValue } from "./assignValue";

export interface IFormReader {
    /**
     * Read entire form.
     * 
     * @param elemOrName Form element or element name (either id, form name or relaxed name).
     */
    read(elemOrName: HTMLElement | string): any;
}

interface IReaderContext {
    /**
     * Parent HTML element that got a name
     */
    parentElements: HTMLElement[];

    /**
     * Parent object (if this is a child object) through a defined name on a non-form element or through dot notation.
     */
    parents: any[];

    /**
     * Named path to this child object. empty for root object.
     */
    path: string[];

    /**
     * Currently generated object.
     */
    currentObject: any;
}

export class FormReader {
    constructor(private prefix: string = 'yo') {

    }

    public read(elemOrName: HTMLElement | string): any {
        var container: HTMLElement;

        if (typeof elemOrName === "string") {
            container = <HTMLElement>document.querySelector(`#${elemOrName},[${this.prefix}-name=\"${elemOrName}\"],[name="${elemOrName}"]`);
            if (!container) {
                throw new Error("Failed to locate '" + elemOrName + "'.");
            }
        } else {
            container = elemOrName;
        }

        var motherObject = {};
        for (let i = 0; i < container.childElementCount; i++) {
            this.visitElement({
                currentObject: motherObject,
                path: [],
                parentElements: [],
                parents: []
            }, <HTMLElement>container.children[i])
        }

        return motherObject;
    }

    private visitElement(context: IReaderContext, element: HTMLElement): any {
        console.log('reading ', element.tagName, JSON.stringify(context.currentObject));

        var childContext = context;

        var name = this.getNonInputName(element);
        if (name) {
            console.log('non input name', name)
        }

        if (name != null) {
            childContext = this.buildNewContextForNonInputName(name, context);
            console.log('built new context for ' + name, JSON.stringify(childContext), 'old context: ', context);
        } else if (this.isInputElement(element)) {

            var name = this.getInputName(element);
            if (name) {
                console.log('resolved name', name);
                var canRead = this.canRead(element);
                if (canRead) {
                    var value = this.getValue(element);
                    if (value !== null) {
                        console.log('**** assigning value', value, element);
                        assignValue(childContext.currentObject, name, value);
                    }
                    // assignValue(childContext.currentObject, name, value, (obj, value, index) => {
                    //     var inputType = element.getAttribute('type');
                    //     if (inputType == "checkbox"){

                    //     }
                    //     if (element.)
                    // });
                }
            }

            // We ignore children of input types.
            return;
        }

        for (let i = 0; i < element.childElementCount; i++) {
            this.visitElement(childContext, <HTMLElement>element.children[i])
        }

    }

    private canRead(element: HTMLElement) {
        var inputType = element.getAttribute('type')?.toLowerCase();
        console.log(inputType, element.outerHTML);
        if (inputType == 'checkbox' || inputType == 'radio') {
            return (element.hasAttribute("checked")) || element.hasAttribute("selected");
        }

        return true;
    }

    /**
     * Should build a new context for a child object (dev have defined a wrapping tag)
     * @param name Name to build from. Can contain dot and array notation.
     * @param parentObject 
     * @param value 
     */
    private buildNewContextForNonInputName(name: string, parentContext: IReaderContext): IReaderContext {
        var childContext: IReaderContext = {
            currentObject: parentContext.currentObject,
            parentElements: [...parentContext.parentElements],
            parents: [...parentContext.parents],
            path: [...parentContext.path]
        };

        var nameParts = name.split('.');
        nameParts.forEach(key => {


            // This is an array item
            if (key.at(-1) == ']') {
                console.log('is array item', key);
                var startSquareBracketPos = key.indexOf('[');
                var arrayIndex = -1;

                // Got an index specified.
                if (startSquareBracketPos < key.length - 2) {
                    const indexStr = key.substring(startSquareBracketPos + 1, key.length - 1);
                    console.log('indexstr', indexStr);
                    arrayIndex = +indexStr;
                    console.log('array index: ' + arrayIndex)
                }

                // Remove []
                key = key.substring(0, startSquareBracketPos);
                console.log('key is now ', key);

                // Create array if items havent been appended before.
                if (!childContext.currentObject.hasOwnProperty(key)) {
                    childContext.currentObject[key] = [];
                    childContext.path.push(`${key}`);
                    childContext.parents.push(childContext.currentObject[key]);
                    console.log('created array')
                }

                if (arrayIndex == -1) {
                    arrayIndex = childContext.currentObject[key].length;
                }

                childContext.path.push(`[${arrayIndex}]`);
                childContext.parents.push(childContext.currentObject[key]);
                childContext.currentObject[key][arrayIndex] = {};
                childContext.currentObject = childContext.currentObject[key][arrayIndex];

            } else {
                console.log('eeey');
                if (!childContext.currentObject.hasOwnProperty(key)) {
                    childContext.currentObject[key] = {};
                    childContext.parents.push(childContext.currentObject);
                }

                childContext.path.push(`${key}`);
                childContext.currentObject = childContext.currentObject[key];
            }
        });

        return childContext;
    }

    private getValue(el: HTMLElement): number | string | boolean | null | any[] {
        var valueStr: string | null = '';

        if (el.tagName == 'SELECT') {
            const sel = <HTMLSelectElement>el;
            if (sel.selectedIndex == -1) {
                return null;
            }

            if (el.hasAttribute("multiple")) {
                let allValues = [];
                for (let i = 0; i < el.childElementCount; i++) {
                    var childElement = <HTMLOptionElement>el.children[i];

                    if (childElement.selected) {
                        console.log('parsing', childElement.outerHTML, typeof childElement.value);
                        var value = this.parseValue(childElement.value);
                        allValues.push(value);
                    }
                }

                return allValues;
            }
            else {
                valueStr = sel.options[sel.selectedIndex].value;
            }

        } else if (el.tagName == 'TEXTAREA') {
            valueStr = el.getAttribute("value") || "";
        } else if (el.tagName == 'INPUT') {
            var input = <HTMLInputElement>el;
            var type = input.type;
            if (type == 'checkbox' || type == "radio") {
                valueStr = input.checked || input.hasAttribute("selected") ? input.value : null;
            } else {
                valueStr = input.value;
            }
        }

        if (valueStr == null) {
            return null;
        }

        console.log(el, 'parsing', valueStr);
        return this.parseValue(valueStr);
    }

    private parseValue(valueStr: string): number | string | boolean {
        console.log('parsing value', valueStr, typeof valueStr);
        if (!valueStr) {
            throw new Error("not specified");
        }

        if (!isNaN(<any>valueStr)) {
            return +valueStr;
        } else if (valueStr.toString().toLowerCase() == 'true') {
            return true;
        } else if (valueStr.toString().toLowerCase() == 'false') {
            return false;
        }

        return valueStr;
    }
    /**
     * Tries to retreive a name from a NON-input element.
     * 
     * These names are used to define child objects for all children of the current HTML element.
     * 
     * The id attribute is not used since it can be defined just to be able to control the HTML.
     * 
     * @param el Element to check for name
     * @returns 
     */
    private getNonInputName(el: HTMLElement): string | null {
        if (this.isInputElement(el)) {
            return null;
        }

        var name = el.getAttribute(`${this.prefix}-name`) || el.getAttribute(`${this.prefix}-collection`);
        return name;
    }

    /**
     * Tries to retreive a name from a HTML input element.
     * 
     * These are names for input elements.
     * 
     * @param el Element to check for name
     * @returns 
     */
    private getInputName(el: HTMLElement): string | null {
        var name = el.getAttribute('name');
        return name;
    }

    private isInputElement(el: HTMLElement): boolean {
        return el.tagName == 'INPUT' || el.tagName == 'SELECT' || el.tagName == 'TEXTAREA';
    }
}