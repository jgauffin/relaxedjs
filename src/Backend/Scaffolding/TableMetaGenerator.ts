import * as sql from 'mssql';

const config: sql.config = {
    user: 'your-username',
    password: 'your-password',
    server: 'your-server',
    database: 'your-database',
};

export class ForeignKey {
    constructor(public referencedTable: string, public referencedColumn: string) {

    }

    name = '';
}

export class Column {
    constructor(public name: string, public sqlDataType: string) {

    }

    jsType?: string;
    isPrimaryKey = false;
    foreignKey?: ForeignKey;
    isNullable: boolean = true;
    maxLength?: number;
}

export class Table {
    constructor(public name: string) {

    }
    columns: Map<string, Column> = new Map();

    get(columnName: string): Column {
        var c = this.columns.get(columnName);
        if (!c) {
            throw new Error(`Failed to find column '${columnName}' in table '${this.name}'.`);
        }

        return c;
    }
};

async function generateTables(pool: sql.ConnectionPool, metadata: Map<string, Table>) {
    const columnsResult = await pool.request().query(`
    SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_CATALOG = '${config.database}'
  `);

    for (const row of columnsResult.recordset) {
        const { TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH } = row;
        var table = metadata.get(TABLE_NAME);
        if (!table) {
            table = new Table(TABLE_NAME);
            metadata.set(TABLE_NAME, table);
        }
        var column=new Column(COLUMN_NAME, DATA_TYPE);
        column.jsType = getType(column.sqlDataType);
        column.isNullable = IS_NULLABLE == 1;
        column.maxLength = CHARACTER_MAXIMUM_LENGTH;

        table.columns.set(COLUMN_NAME, column);
    }
}

async function generateKeys(pool: sql.ConnectionPool, metadata: Map<string, Table>) {
    const primaryKeysResult = await pool.request().query(`
    SELECT TABLE_NAME, COLUMN_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE CONSTRAINT_NAME LIKE 'PK_%'
  `);
    for (const row of primaryKeysResult.recordset) {
        const { TABLE_NAME, COLUMN_NAME } = row;
        var table = metadata.get(TABLE_NAME);
        if (!table) {
            continue;
        }

        var column = table.columns.get(COLUMN_NAME);
        if (!column) {
            continue;
        }

        column.isPrimaryKey = true;
    }
}

async function generateForeignKeys(pool: sql.ConnectionPool, metadata: Map<string, Table>) {

    const foreignKeysResult = await pool.request().query(`
    SELECT 
      f.name AS foreign_key_name, 
      OBJECT_NAME(f.parent_object_id) AS table_name, 
      COL_NAME(fc.parent_object_id, fc.parent_column_id) AS column_name, 
      OBJECT_NAME(f.referenced_object_id) AS referenced_table_name,
      COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS referenced_column_name
    FROM sys.foreign_keys AS f
    INNER JOIN sys.foreign_key_columns AS fc 
      ON f.OBJECT_ID = fc.constraint_object_id
  `);
    for (const row of foreignKeysResult.recordset) {
        const { foreign_key_name, table_name, column_name, referenced_table_name, referenced_column_name } = row;
        var table = metadata.get(table_name);
        if (!table) {
            continue;
        }

        var column = table.columns.get(column_name);
        if (!column) {
            continue;
        }

        column.foreignKey = new ForeignKey(referenced_table_name, referenced_column_name);
        column.foreignKey.name = foreign_key_name;
    }
}

function getType(mssqlType: string): string|undefined {
    switch (mssqlType) {
      case 'nvarchar':
      case 'char':
      case 'varchar':
      case 'text':
        return 'string';
      case 'int':
      case 'bigint':
      case 'smallint':
      case 'tinyint':
        return 'number';
      case 'bit':
        return 'boolean';
      case 'datetime':
      case 'smalldatetime':
        return 'Date';
      default:
        return undefined;
    }
  }

async function generateMetadata(): Promise<Map<string, Table>> {
    const pool = await new sql.ConnectionPool(config).connect();

    let metadata: Map<string, Table> = new Map();
    generateTables(pool, metadata);
    generateKeys(pool, metadata);
    generateForeignKeys(pool, metadata);
    return metadata;
}

generateMetadata();