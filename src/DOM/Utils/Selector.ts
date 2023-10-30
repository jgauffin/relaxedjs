/**
 * Used to select items in code. 
 * 
 * The lookup depends on what the selector is. If "#someId" is used, only getElementById will be used for the lookup.
 * Prefixing the name with $ ("$someName") will result in the following lookup:
 * 
 * 1. "[prefix]-name" - Normally an attributed named "yo-name", but the prefix is configurable.
 * 2. "[prefix]-collection" - Normally an attributed named "yo-name", but the prefix is configurable.
 * 3. "[name]" - Name attribute
 * 4. "[id]" - The standard id attribute.
 * 
 * For all other strings, the normal querySelectorAll is used.
 */

export class Selector {
    private scope: any;

    constructor(scope?: HTMLElement, private prefix: string = 'data') {
        if (typeof scope === "undefined") {
            this.scope = document;
        } else {
            this.scope = scope;
        }
        if (!this.scope)
            throw new Error("Failed to identify scope");
    }

    /**
     * Find first matching element.
     * @param idOrselector Selector to find. Read class summary for details.
     * @returns Item if found (or Error if not found).
     */
    one(idOrselector: string): HTMLElement {
        if (idOrselector.substring(0, 1) === "#") {
            let el2 = this.scope.querySelector(idOrselector);
            if (!el2) {
                throw new Error(`Failed to find element by id '${idOrselector}'.`);
            }
            return <HTMLElement>el2;
        }

        if (idOrselector.substring(0, 1) === "$") {
            idOrselector = idOrselector.substring(1);
            var result = this.scope.querySelector(`[${this.prefix}-name='${idOrselector}'],[${this.prefix}-collection='${idOrselector}'],[name="${idOrselector}"],#${idOrselector}`);
            if (result)
                return result;
        }

        var item = <HTMLElement>this.scope.querySelector(idOrselector);
        if (!item)
            throw Error(`Failed to find "${idOrselector}".`);
        return item;
    }

    /**
     * Find all matching element.
     * @param selector Selector to find. Read class summary for details.
     * @returns Item if found (or Error if not found).
     */
    all(selector: string): HTMLElement[] {
        const result: HTMLElement[] = [];

        if (selector.substring(0, 1) === "$") {
            selector = selector.substring(1);
            var queryStr=`[${this.prefix}-name='${selector}'],[${this.prefix}-collection='${selector}'],[name="${selector}"],#${selector}`;
            var items2 = this.scope.querySelectorAll(queryStr);
            for (let i = 0; i < items2.length; i++) {
                console.log('found', items2[i]);
                result.push(<HTMLElement>items2[i]);
            }
            return result;
        }

        const items = this.scope.querySelectorAll(selector);
        for (let i = 0; i < items.length; i++) {
            result.push(<HTMLElement>items[i]);
        }

        return result;
    }

}
