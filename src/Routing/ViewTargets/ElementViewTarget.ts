import { IViewTarget } from "../IViewTarget";

/**
* Render view into a parent element
*/
export class ElementViewTarget implements IViewTarget {
    private container: HTMLElement;

    /**
     *
     * @param selectorOrElement Element to render view in
     * @returns {}
     */
    constructor(selectorOrElement: string | HTMLElement) {
        if (typeof selectorOrElement === "string") {
            var elem = document.getElementById(selectorOrElement.substring(1));
            if (!elem) {
                throw `Could not locate "${selectorOrElement}"`;
            }
            this.container = elem;
        } else {
            this.container = selectorOrElement;
        }

        this.name = this.container.id;
    }

    setTitle(title: string): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Id attribute of the container element.
     */
    public name = "";

    assignOptions() {

    }

    attachViewModel(script: HTMLScriptElement) {
        this.container.appendChild(script);
    }

    /**
     * Will remove innerHTML and append the specified element as the first child.
     * @param element generated view
     */
    public render(element: HTMLElement) {
        //delete everything but our view model script.
        while (this.container.firstElementChild && this.container.firstElementChild.nextElementSibling != null)
            this.container.removeChild(this.container.firstElementChild);

        this.container.innerHTML = "";
        this.container.appendChild(element);
    }
}