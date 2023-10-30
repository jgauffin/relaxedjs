import { Component } from "../../components/Exports";
import { component } from "../../components/implementations/Decorator";

export class OpenModal{
    constructor(name: string){

    }
}
export class CloseModal{
    constructor(name: string){

    }
}

export class ModalCompleted{

}

export class ModalEvent{
    constructor(public action: string){
        
    }
}

/**
 * A modal window.
 * 
 * Will send @see ButtonSignal when buttons are pressed. Default button names are 'ok' and 'cancel'
 * 
 */
@component('modal')
export class ModalComponent extends Component {

    async initialize(): Promise<void>{
        //this.context.signal('hello');
        //this.context.receiveSignal(x => this.onHello(x))
    }

    okText: string = 'Ok';
    cancelText: string = 'Cancel';

    onOk(onHello: any) {
        this.context.signal.up(new ModalEvent('ok'));
    }

    onCancel(){
        this.context.signal.up(new ModalEvent('cancel'));
    }


}