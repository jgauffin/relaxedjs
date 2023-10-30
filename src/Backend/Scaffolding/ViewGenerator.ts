import { StringBuilder } from "../Utils/StringBuilder";
import { Table } from "./TableMetaGenerator";

export class ViewGenerator {

    generateCreatePage(table: Table): string {
        var sb = new StringBuilder(0);
        sb.appendLine(`<form name="Add${table.name}Form">`);
        table.columns.forEach(x => {
            if (x.isPrimaryKey){
                return;
            }

            sb.appendLineIndent('<div>');
            sb.appendLine(`<label for="${x.name}">${x.name}</label/>`);
            sb.append(`<input name="${x.name}" type="${this.getInputType(x.jsType)}"`);
            if (!x.isNullable){
                sb.append(" required");
            }
            sb.appendLine(" />");

            sb.dedentAppendLine('/<div>');
        });

        sb.appendLineIndent('<div>');
        sb.appendLine('<button name="save">Save</button>');
        sb.appendLine('<button name="cancel">Cancel</button>');
        sb.dedentAppendLine('</div>'); 
        

        sb.dedentAppendLine("</form>");
        

        return sb.toString();
    }

    generateCreateView(table: Table): string {
        var sb = new StringBuilder(0);
        sb.appendLine(`<form name="Add${table.name}Form">`);
        table.columns.forEach(x => {
            if (x.isPrimaryKey){
                return;
            }

            sb.appendLineIndent('<div>');
            sb.appendLine(`<label for="${x.name}">${x.name}</label/>`);
            sb.append(`<input name="${x.name}" type="${this.getInputType(x.jsType)}"`);
            if (!x.isNullable){
                sb.append(" required");
            }
            sb.appendLine(" />");

            sb.dedentAppendLine('/<div>');
        });

        sb.appendLineIndent('<div>');
        sb.appendLine('<button name="save">Save</button>');
        sb.appendLine('<button name="cancel">Cancel</button>');
        sb.dedentAppendLine('</div>');

        sb.dedentAppendLine("</form>");
        

        return sb.toString();
    }

    generateEditView(table: Table): string {
        var sb = new StringBuilder(0);
        sb.appendLine(`<form name="Edit${table.name}Form">`);
        table.columns.forEach(x => {
            if (x.isPrimaryKey){
                return;
            }


            sb.appendLineIndent('<div>');
            sb.appendLine(`<label for="${x.name}">${x.name}</label/>`);
            sb.append(`<input name="${x.name}" type="${this.getInputType(x.jsType)}"`);
            if (!x.isNullable){
                sb.append(" required");
            }
            sb.appendLine(" />");

            sb.dedentAppendLine('/<div>');
        });

        sb.appendLineIndent('<div>');
        sb.appendLine('<button name="save">Save</button>');
        sb.appendLine('<button name="cancel">Cancel</button>');
        sb.dedentAppendLine('</div>');

        sb.dedentAppendLine("</form>");
        

        return sb.toString();
    }
    
    generateDeleteView(table: Table): string {
        var sb = new StringBuilder(0);
        sb.appendLine(`<form name="Delete${table.name}Form">`);

        var nameColumn = "";
        for (let [_, value] of table.columns) {
            if (value.isPrimaryKey || value.jsType !== "string"){
                continue;
            }

            nameColumn=value.name;
        }

        sb.appendLineIndent('<div>')
        sb.appendLine(`Are you sure that you want to delete '${nameColumn}'?`);
        sb.dedentAppendLine('</div>');

        sb.appendLineIndent('<div>');
        sb.appendLine('<button name="add">Add</button>');
        sb.appendLine('<button name="cancel">Add</button>');
        sb.dedentAppendLine('</div>');

        sb.dedentAppendLine("</form>");

        return sb.toString();
    }

    private getInputType(jsType?: string) {
        switch (jsType) {
            case "number":
                return "number";
            case "date":
                return "datetime-local";
            default:
                return "text";
        }
    }
}
