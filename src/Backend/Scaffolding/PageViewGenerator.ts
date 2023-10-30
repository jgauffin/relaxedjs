import { StringBuilder } from "../Utils/StringBuilder";
import { Table } from "./TableMetaGenerator";
import * as pluralize from "pluralize";

export class PageViewGenerator {

    generateCreate(table: Table): string {
        var singular = pluralize.singular(table.name);

        var sb = new StringBuilder(0);
        sb.appendLineIndent('<div>');
        sb.appendLine(`<h1>New ${singular}</h1>`);

        sb.appendLine(`<Create${singular}></Create${singular}>`);
        sb.dedentAppendLine('</div>');

        return sb.toString();
    }

    generateList(table: Table): string {
        var singular = pluralize.singular(table.name);

        var sb = new StringBuilder(0);
        sb.appendLineIndent('<div>');
        sb.appendLine(`<h1>List ${singular}</h1>`);

        sb.appendLine(`<List${singular} />`);
        sb.dedentAppendLine('</div>');

        sb.appendLineIndent('<div if="vm.isAdmin">');
        sb.appendLine(`<Create${singular} />`)
        sb.dedentAppendLine('</div>');

        return sb.toString();
    }

    generateEdit(table: Table): string {
        var singular = pluralize.singular(table.name);

        var sb = new StringBuilder(0);
        sb.appendLineIndent('<div>');
        sb.appendLine(`<h1>New ${singular}</h1>`);
        sb.appendLine(`<Edit${singular} />`);
        sb.dedentAppendLine('</div>');

        sb.appendLineIndent('<div>');
        sb.appendLine('<button name="btnDelete">Delete</button>');
        sb.dedentAppendLine('</div>');

        return sb.toString();
    }

    generateDetails(table: Table): string {
        var singular = pluralize.singular(table.name);
        var plural = pluralize.plural(table.name);

        var sb = new StringBuilder(0);
        sb.appendLineIndent('<div>');
        sb.appendLine(`<h1>New ${singular}</h1>`);

        sb.appendLine(`<Create${singular}></Create${singular}>`);
        sb.dedentAppendLine('</div>');

        sb.appendLineIndent('<div>');
        sb.appendLine(`<a href="/${plural}/{{id}}">Edit</a>`);
        sb.appendLine('<button name="btnDelete">Delete</button>');
        sb.dedentAppendLine('</div>');

        return sb.toString();
    }
}
