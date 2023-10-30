import { Component } from "../../components/Exports";
import { component } from "../../components/implementations/Decorator";
import { ItemCreated } from "../items/add";
import { CloseModal, OpenModal } from "../tools/modal";

@component("home")
export class HomeComponent extends Component {

    async initialize(): Promise<void> {
        this.context.signal.receive<ItemCreated>(signal => this.onItemCreated(signal));
    }
    
    async onItemCreated(signal: ItemCreated): Promise<void> {
        this.context.signal.down(new CloseModal('addModal'));
    }
    
    showAdd(){
        this.context.signal.down(new OpenModal('addModal'));
    }
    
}