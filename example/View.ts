import { FormReader } from "../dom/FormReader";

export class Context {
    data: any;
    element: HTMLElement = null!;
}
export class ViewBase {
    elem(parent: HTMLElement, tagName: string): HTMLElement {
        return parent;
    }


}
//type Updater = (data: any) => void;

export class MyView extends ViewBase {
    //private updaters: Updater[] = [];


    render(root: HTMLElement, context: Context) {
        const div1 = this.elem(root, "DIV");
        if (context.data['user']) {
            const div2 = this.elem(div1, "DIV");
            const span1 = this.elem(div2, "SPAN");
            span1.innerText = `Hello ${context.data['world']}!`;
            const table1 = this.elem(div2, "TABLE");
            const tbody1 = this.elem(table1, "TBODY");
            this.forLoop0(tbody1, context);
        }
        else {
            const section1 = this.elem(div1, "SECTION");
            section1.innerText = ' Hello world! 4';
        }
    }

    readAddUser(): any {
        var reader= new FormReader();
        var form = <HTMLElement>document.querySelector('form[name="AddUser"]');
        return reader.read(form);
    }

    forLoop0(parent: HTMLElement, context: Context) {
        for (var item in context.data['users']) {
            context.data['item'] = item;
            this.appendForRow0(parent, context);
        }
    }

    appendForRow0(parent: HTMLElement, context: Context) {
        const tr1 = this.elem(parent, "TR");
        const td1 = this.elem(tr1, "TD");
        td1.setAttribute("id", context.data['item']['id']);
        td1.innerText = context.data['item'].FirstName;
        const td2 = this.elem(tr1, "TD");
        td2.innerText = ' edit 4';
    }

    updateView(data: any) {


    }
}

