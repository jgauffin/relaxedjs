import { Component } from "../../components/Exports";
import { component } from "../../components/implementations/Decorator";
import { ModalEvent } from "../tools/modal";
import { TodoItem, TodoService } from "./TodoItemService";



export class TodoItemEvent {
    constructor(public item: TodoItem){

    }
}

export class ItemCreated{
    constructor(public item: TodoItem){

    }
}

@component("items-add")
export class AddComponent extends Component {

    constructor(private todoService: TodoService){
        super();
    }

    async initialize(): Promise<void> {
        this.context.signal.receive<ModalEvent>(x=>this.onModalCompleted(x.action))
    }

    data: TodoItem = new TodoItem();

    add(){
        this.todoService.create(this.data);
        this.context.signal.up(new ItemCreated(new TodoItem()));
    }

    cancel(){
        this.context.signal.up(new ItemCreated(new TodoItem()));
    }

    private async onModalCompleted(actionName: string): Promise<void> {
        if(actionName == 'ok')
        {
            await this.save();
        }

        else{
            this.context.signal.down(new ModalEvent('close'));
            this.context.signal.up(new ModalEvent('close'));
        }
        
    }
    private save(): Promise<void>{
        return Promise.resolve();
    }
    
}