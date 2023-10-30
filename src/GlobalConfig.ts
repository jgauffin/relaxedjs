import { Container } from "./DependencyInjection/Container";
import { Router } from "./Routing/Implementation/Router";

export class Config{
    container: Container;
    router: Router;

    constructor(){
        this.container = new Container();
        this.router = new Router();
    }
}


export var config = new Config();