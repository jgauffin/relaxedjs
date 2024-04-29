import { IArrayProxy, ListElementNotification, ListNotification, isArrayProxy } from "./ArrayProxy";
import { PropertyChangeReceiver } from "./Notifications";
import { ObservableList } from "./ObservableArray";
import { createProxy } from "./ProxyFactory";
import { isValueProxy } from "./ProxyTools";

export interface ColumnDefinition{
    columnName
}

export class TableAdapter implements PropertyChangeReceiver {
    private rows = new Map<any, HTMLTableRowElement>;
    private rowMap = new Map<any, any>;
    private collection: any[];

    constructor(private table: HTMLTableElement, collection: any[]) {

        if (!isArrayProxy(collection)){

        }
        if (!isValueProxy(collection)){
            this.collection = createProxy(collection);
        }else{
            this.collection = collection;
        }

        var proxy = <IArrayProxy><any>this.collection;
        proxy.arrayChanges.subscribe(x=>{this.onArrayChanged(x)});
        proxy.elementChanges.subscribe(x=> this.onElementChanged(x));

        var headerCells = table.querySelectorAll('thead tr th');
        headerCells.forEach(x=>{
            var  
        })

    }

    /**
     * 
     * @param instance element
     * @param key property in element. If sy
     */
    propertyChanged(instance: any, key: string | symbol): void {
        
    }

    private onArrayChanged(e: ListNotification<any>){

    }

    private onElementChanged(e:ListElementNotification<any>){
        
    }

    updateTable(collection: ObservableList<any>){
        collection.subscribe(this);
    }
}

