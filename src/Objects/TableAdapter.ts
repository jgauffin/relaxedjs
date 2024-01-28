import { PropertyChangeReceiver } from "./Notifications";
import { ObservableList } from "./ObservableArray";

export interface ColumnDefinition{
    columnName
}

export class TableAdapter implements PropertyChangeReceiver {
    private rows = new Map<any, HTMLTableRowElement>;
    private rowMap = new Map<any, 

    constructor(private table: HTMLTableElement, private collection: ObservableList<any>) {
        var headerCells = table.querySelectorAll('thead tr th');
        headerCells.forEach(x=>{
            var  
        })

        collection.subscribe(this)

    }

    /**
     * 
     * @param instance element
     * @param key property in element. If sy
     */
    propertyChanged(instance: any, key: string | symbol): void {
        
    }

    updateTable(collection: ObservableList<any>){
        collection.subscribe(this);
    }
}

