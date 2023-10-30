export class ElementUtils {

    constructor(private elementPrefix: string = 'data'){

    }
    removeChildren(n: Node) {
        if (!n) {
            throw new Error(`Element not set: ${n}`);
        }
        while (n.firstChild) {
            n.removeChild(n.firstChild);
        }
    }

    moveChildren(source: HTMLElement, target: HTMLElement) {
        while (source.firstChild) {
            target.appendChild(source.firstChild);
        }

        if (source.parentElement) {
            source.parentElement.removeChild(source);
        } else {
            source.remove();
        }
    }

    getIdentifier(e: HTMLElement): string {
        if (e.id)
            return e.id;

        var name = e.getAttribute("name");
        if (name != null)
            return name;

        name = e.getAttribute(`${this.elementPrefix}-name`);
        if (name != null)
            return name;

        var attrs = '';
        for (var i = 0; i < e.attributes.length; i++) {
            attrs = `${attrs + e.attributes[i].name}=${e.attributes[i].value},`;
        }

        return `${e.tagName}[${attrs.substr(0, attrs.length - 1)}]`;
    }
}
