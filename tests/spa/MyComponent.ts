import { inheritInnerComments } from "@babel/types";
import { Route } from "../../src/Routing/Implementation/Route";
import { IRoute } from "../../src/Routing/IRoute";
import { IRouteContext } from "../../src/Routing/IRouteContext";
import { IComponent, IComponentContext } from "../../src/Components/Exports";

interface IMyData{

}

export class MyComponent implements IComponent {
    constructor() {

    }


    context: IComponentContext;

    data: IMyData;

    async onInit(): Promise<void> {
        
    }

    // form submit are automatically bound
    // using "on[formName]Submit"
    // data is automatically updated
    async onMyFormSubmit(data:any): Promise<void> {

    }


    // Buttons are automatically bound
    // with the format "onButtonName"
    async onSubmit() : Promise<void> {

    }

    async onCancel(): Promise<void> {

    }
}

class Configuration{
    public routes: IRoute[] = [];
    public routeTargets: Map<IRoute,  { new(): IComponent }> = new Map();

    mapRoute(url : string,  routeTarget: { new(): IComponent }){
        var route=new Route(url);
        this.routes.push(route);
        this.routeTargets.set(route, routeTarget);
    }
}
class Router{
    constructor(private config: Configuration){

    }
    async invoke(url: string): Promise<void>{
        if (url.length) {
            url = url
                .replace(/\/+/g, "/") //remove double slashes
                .replace(/^\/|\/($|\?)/, "") //trim slashes
                .replace(/#.*$/, "");
        }

        var ctx: IRouteContext={
url,
targetElement:  undefined
        };
        var route = this.config.routes.find(x=>x.isMatch(ctx));
        if (!route){
            return;
        }

        var targetType = this.config.routeTargets.get(route);
        if (!targetType){
            return;
        }

        var invoker: IComponentInvoker = null;
        var target = new targetType();
        await invoker.invoke(route, target);
    }
}


var config = new Configuration();
config.mapRoute('/users/{id}', MyComponent);

