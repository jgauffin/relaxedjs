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

    generateListComponent(table: Table): string {
        var entityName = pluralize.singular(table.name);
        var pluarlis = pluralize.plural(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`@component('List${pluarlis}', '/${entityName}')`);
        sb.appendLine(`export class Edit${entityName}Component implements Component`);
        sb.appendLineIndent('{');

        sb.appendLine(`constructor(private service: ${entityName}Service) {`);
        sb.appendLine('super()');
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLine(`data: ${entityName}[] = [];`);

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IComponentContext): Promise<void> {');
        sb.appendLine('this.id = +context.routeData["id"];');
        sb.appendLine(`this.data = await this.service.list();`);
        sb.dedentAppendLine('}');

        sb.appendLine();
        sb.dedentAppendLine('}');
        return sb.toString();
    }


    generateCreateComponent(table: Table) {
        var className = pluralize.singular(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`import {${className}, createEmpty} from "../"`);
        sb.appendLine(`@component('Create${className}', '/${table.name}/new')`);
        sb.appendLine(`export class Create${className}Component implements Component`);
        sb.appendLineIndent('{');

        sb.appendLine(`constructor(private service: ${className}Service) {`);
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLine(`data: ${className} = createEmpty();`);

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IComponentContext): Promise<void> {');
        sb.dedentAppendLine('}');

        sb.appendLine();

        sb.appendLineIndent('async onSave(): Promise<void> {');
        sb.appendLine('await this.service.create(this.data);');
        sb.appendLine(`await this.context.signal.send(new ${className}Created(this.data));`);
        sb.dedentAppendLine('}');

        sb.appendLineIndent('async onCancel(): Promise<void> {');
        sb.appendLine('await this.service.create(this.data);');
        sb.appendLine(`await this.context.signal.send(new OperationCancelled('Create${className}'));`);
        sb.dedentAppendLine('}');


    }

    generateEditComponent(table: Table) {
        var className = pluralize.singular(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`import {${className}, createEmpty} from "../"`);
        sb.appendLine(`@component('Edit${className}', '/${table.name}/+id/edit')`);
        sb.appendLine(`export class Edit${className}Component implements Component`);
        sb.appendLineIndent('{');

        sb.appendLine(`constructor(private service: ${className}Service) {`);
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLine(`data: ${className} = createEmpty();`);
        sb.appendLine(`id = 0;`);

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IComponentContext): Promise<void> {');
        sb.appendLine('this.id = +context.routeData["id"];');
        sb.appendLine(`this.data = await this.service.get(this.id);`);
        sb.dedentAppendLine('}');

        sb.appendLine();

        sb.appendLineIndent('async onSubmit(): Promise<void> {');
        sb.appendLine('await this.service.edit(this.data);');
        sb.appendLine(`await this.context.signal.send(new ${className}Updated(this.data));`);
        sb.dedentAppendLine('}');

        sb.appendLineIndent('async onCancel(): Promise<void> {');
        sb.appendLine('await this.service.create(this.data);');
        sb.appendLine(`await this.context.signal.send(new OperationCancelled('Edit${className}'));`);
        sb.dedentAppendLine('}');

    }

    generateDetailsComponent(table: Table) {
        var className = pluralize.singular(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`import {${className}, createEmpty} from "../"`);
        sb.appendLine(`@component('${className}Details')`);
        sb.appendLine(`export class Details${className}Component implements Component`);
        sb.appendLineIndent('{');

        sb.appendLine(`constructor(private service: ${className}Service) {`);
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLine(`data = createEmpty();`);
        sb.appendLine(`id = 0;`);

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IComponentContext): Promise<void> {');
        sb.appendLine('this.id = +context.routeData["id"];');
        sb.appendLine(`this.data = await this.service.get(this.id);`);
        sb.dedentAppendLine('}');

        sb.appendLine();
    }

    generateDeleteComponent(table: Table) {
        var className = pluralize.singular(table.name);

        const sb: StringBuilder = new StringBuilder();
        sb.appendLine(`import {${className}} from "../"`);
        sb.appendLine(`@component('Delete${className}', '/${className}/delete/+id')`);
        sb.appendLine(`export class Delete${className}Component implements Component`);
        sb.appendLineIndent('{');

        sb.appendLine(`constructor(private service: ${className}Service) {`);
        sb.appendLine('}');

        sb.appendLine();

        sb.appendLine(`data: ${className} = createEmpty();`);
        sb.appendLine(`id = 0;`);

        sb.appendLine();

        sb.appendLineIndent('async initialize(context: IComponentContext): Promise<void> {');
        sb.appendLine('this.id = +context.routeData["id"];');
        sb.appendLine(`this.data = await this.service.get(this.id);`);
        sb.dedentAppendLine('}');

        sb.appendLine();

        sb.appendLineIndent('async onSubmit(): Promise<void> {');
        sb.appendLine('await this.service.delete(this.data.id);');
        sb.appendLine(`await this.context.signal.send(new ${className}Deleted(this.data));`);
        sb.dedentAppendLine('}');

        sb.appendLineIndent('async onCancel(): Promise<void> {');
        sb.appendLine('await this.service.create(this.data);');
        sb.appendLine(`await this.context.signal.send(new OperationCancelled('Delete${className}'));`);
        sb.dedentAppendLine('}');

    }    

    generateService(table: Table) {
        var className = pluralize.singular(table.name);
        const sb: StringBuilder = new StringBuilder();
        sb.appendLineIndent(`export class${className}Service {`);
        sb.appendLine('constructor(httpClient: IHttpClient, private signal: ISignalTransmitter) {}');
        sb.appendLine();

        sb.appendLineIndent(`async get(id: number): Promise<${className}> {`);
        sb.appendLine(`var response = await this.httpClient.get('/api/${pluralize.plural(table.name).toLowerCase()}/' + id + '/', dto);`)
        sb.appendLineIndent('if (!respone.success) {')
        sb.appendLine(`throw new Error('Failed to get ' + id + ': ' + response.statusDescription);`);
        sb.dedentAppendLine('}');
        sb.appendLine('let entity = await response.json<int>();');
        sb.appendLine('return entity;')
        sb.dedentAppendLine('}');

        sb.appendLineIndent(`async create(entity: ${className}): Promise<void> {`);
        sb.appendLine('var dto = this.convertEntity(entity);');
        sb.appendLine(`var response = await this.httpClient.post('/api/${pluralize.plural(table.name).toLowerCase()}/', dto);`)
        sb.appendLineIndent('if (!respone.success) {')
        sb.appendLine(`throw new Error('Failed to post ' + response.statusDescription);`);
        sb.dedentAppendLine('}');
        sb.appendLine('entity.id = response.body<int>();');
        sb.appendLine(`this.signal.transmit(new ${className}Created(entity));`);
        sb.dedentAppendLine('}');

        sb.appendLineIndent(`async update(entity: ${className}): Promise<void> {`);
        sb.appendLine('var dto = this.convertEntity(entity);');
        sb.appendLine(`var response = await this.httpClient.post('/api/${pluralize.plural(table.name).toLowerCase()}/', dto);`)
        sb.appendLineIndent('if (!respone.success) {')
        sb.appendLine(`throw new Error('Failed to post ' + response.statusDescription);`);
        sb.dedentAppendLine('}');
        sb.appendLine('entity.id = response.body<int>();');
        sb.appendLine(`this.signal.transmit(new ${className}Updated(entity));`);
        sb.dedentAppendLine('}');

        sb.appendLineIndent(`async delete(id: number): Promise<void> {`);
        sb.appendLine(`var response = await this.httpClient.post('/api/${pluralize.plural(table.name).toLowerCase()}/', dto);`)
        sb.appendLineIndent('if (!respone.success) {')
        sb.appendLine(`throw new Error('Failed to delete ' + id + ': + + response.statusDescription);`);
        sb.dedentAppendLine('}');
        sb.appendLine('entity.id = response.body<int>();');
        sb.appendLine(`this.signal.transmit(new ${className}Deleted(entity.id));`);
        sb.dedentAppendLine('}');


        sb.appendLineIndent(`private convertDto(dto: ${className}Dto): ${className} {`);
        sb.append(`var entity = new ${className}(`);
        table.columns.forEach(x => {
            if (x.isNullable) {
                return;
            }
            sb.append(`${x.name} = dto.${x.name}, `);
        });
        sb.remove(2);
        sb.appendLine(');');
        table.columns.forEach(x => {
            if (!x.isNullable) {
                return;
            }
            sb.appendLine(`entity.${x.name} = dto.${x.name};`);
        });
        sb.appendLine("return entity;");
        sb.dedentAppendLine("}");

        sb.appendLineIndent(`private convertEntity(entity: ${className}): ${className}Dto {`);
        sb.appendLine(`var dto = new ${className}Dto();`);
        table.columns.forEach(x => {
            sb.append(`dto.${x.name} = entity.${x.name};`);
        });
        sb.appendLine(');');
        sb.appendLine("return dto;");
        sb.dedentAppendLine("}");


    }

    generateEntity(table: Table): string {
        const sb: StringBuilder = new StringBuilder();
        var className = pluralize.singular(table.name);
        sb.appendLineIndent(`export class ${className} {`);
        sb.appendLineIndent("constructor(");

        var first = true;
        table.columns.forEach(x => {
            if (x.isNullable) {
                return;
            }
            if (first) {
                first = false;
            } else {
                sb.appendLine();
            }

            sb.append(`private ${x.name}: ${x.jsType ?? x.sqlDataType}`);
        });
        sb.appendLine();
        sb.dedentAppendLine(');');

        sb.appendLine();

        table.columns.forEach(x => {
            if (!x.isNullable) {
                return;
            }

            sb.appendLine(`${x.name}?: ${x.jsType ?? x.sqlDataType}`);
        });

        sb.dedentAppendLine('}');

        sb.append(`export function createEmpty(): ${className} = new ${className}(`);
        var first = true;
        table.columns.forEach(x => {
            if (x.isNullable) {
                return;
            }
            if (first) {
                first = false;
            } else {
                sb.append(',');
            }

            switch (x.jsType ?? x.sqlDataType) {
                case 'string': sb.append('""'); break;
                case 'number': sb.append('-1'); break;
                case "date": sb.append('new Date()'); break;
                case 'boolean': sb.append('false'); break
                default: sb.append("''"); break
            }
        });
        sb.appendLine(')');

        return sb.toString();
    }

    generateDto(table: Table): string {
        const sb: StringBuilder = new StringBuilder();
        var className = pluralize.singular(table.name);
        sb.appendLineIndent(`export class ${className}Dto {`);
        table.columns.forEach(x => {
            sb.appendLine(`${x.name}?: ${x.jsType ?? x.sqlDataType}`);
        });

        sb.dedentAppendLine('}');
        return sb.toString();
    }
}
/*    async initialize(context: IComponentContext): Promise<void>{
    context.signal('hello');
    context.receiveSignal(x => this.onHello(x))
}

generateDto(table: Table){
    var sb = new StringBuilder()
}
}
*/