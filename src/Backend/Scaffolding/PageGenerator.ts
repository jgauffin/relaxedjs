import { StringBuilder } from "../Utils/StringBuilder";
import { Table } from "./TableMetaGenerator";
import * as pluralize from "pluralize";

/**
 * Page: Create => Edit
 * Page: Details => Details
 * Page: List => List, Create
 * Page: Edit => Edit
 * 
 * Components: Edit, List, Details
 */
export class ComponentGenerator {
    createPage(table: Table) {
        var className = pluralize.singular(table.name);
        var plural = pluralize.plural(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`import {${className}, createEmpty} from "../"`);
        sb.appendLine(`@page('/${plural}/new')`);
        sb.appendLineIndent(`export class Create${className}Page {`);

        sb.appendLine(`constructor() {`);
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLine(`data: ${className} = createEmpty();`);

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IPageContext): Promise<void> {');
        sb.appendLine(`context.signal.receive<${className}Created>(signal => {
        context.redirect('/${plural}/' + signal.id + '/')
    })`)
        sb.dedentAppendLine('}');

        sb.appendLine();

        sb.appendLineIndent('async onSubmit(): Promise<void> {');
        sb.appendLine('await this.service.create(this.data);');
        sb.appendLine(`context.redirect('/${className}/' + this.data.id);`);
        sb.dedentAppendLine('}');

    }

    listPage(table: Table) {
        var className = pluralize.singular(table.name);
        var plural = pluralize.plural(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`import {${className}, createEmpty} from "../"`);
        sb.appendLine(`@page('/${plural}/')`);
        sb.appendLineIndent(`export class Create${className}Page {`);

        sb.appendLine(`constructor() {`);
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IPageContext): Promise<void> {');
        sb.appendLine(`context.signal.receive<${className}Created>(signal => {
        await context.signal.down(signal);
    })`)
        sb.dedentAppendLine('}');

        sb.appendLine();

        sb.dedentAppendLine('}');
    }

    detailsPage(table: Table) {
        var className = pluralize.singular(table.name);
        var plural = pluralize.plural(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`import {${className}, createEmpty} from "../"`);
        sb.appendLine(`@page('/${plural}/details')`);
        sb.appendLineIndent(`export class ${className}DetailPage {`);

        sb.appendLine(`constructor() {`);
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLine(`data: ${className} = createEmpty();`);

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IPageContext): Promise<void> {');
        sb.dedentAppendLine('}');

        sb.appendLine();

        sb.appendLineIndent('async onBtnEdit(): Promise<void> {');
        sb.appendLine('await this.service.create(this.data);');
        sb.appendLine(`context.redirect('/${className}/' + this.data.id);`);
        sb.dedentAppendLine('}');

        sb.appendLineIndent('async onBtnDelete(): Promise<void> {');
        sb.appendLine('await this.service.create(this.data);');
        sb.appendLine(`context.redirect('/${className}/' + this.data.id);`);
        sb.dedentAppendLine('}');


        sb.dedentAppendLine('}');
    }    

}