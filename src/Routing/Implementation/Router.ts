import { IRoute } from "../IRoute";
import { IRouteContext } from "../IRouteContext";
import { Route } from "./Route";
import { IComponentRegistration, registrations } from "../../Components/Implementation/Decorator";
import { IPage } from "../../Components/IPage";

export interface PageType { new(...args: any[]): IPage };

export type RouteMatch = {
    pageType: PageType;
    routeData: any
}

/**
* Translates a uri into a route.
*/
export class Router {
    private routes: IRoute[] = [];
    private routeTargets: Map<IRoute, PageType> = new Map();

    constructor(customRegistrations?: IComponentRegistration[]) {
        var regs = customRegistrations ?? registrations;
        regs.forEach(x => {
            if (x.route) {
                var route = new Route(x.route.path);
                this.routes.push(route);
                this.routeTargets.set(route, x.componentConstructor);
            }
        });
    }

    /** @inheritdoc */
    mapRoute(url: string, componentType: PageType, outputTarget?: string) {
        var route = new Route(url, outputTarget);
        this.routes.push(route);
        this.routeTargets.set(route, componentType);
    }

    /** @inheritdoc */
    mapCustomRoute(route: IRoute, componentType: PageType) {
        if (typeof route === "undefined")
            throw new Error("Route must be specified.");

        this.routes.push(route);
        this.routeTargets.set(route, componentType);
    }


    /** @inheritdoc */
    match(url: string): RouteMatch | null {
        if (url.length) {
            url = url
                .replace(/\/+/g, "/") //remove double slashes
                .replace(/^\/|\/($|\?)/, "") //trim slashes
                .replace(/#.*$/, "");
        }
        const ctx: IRouteContext = {
            url: url
        };


        var routeData: any | null = null;
        let route: IRoute | null = null;
        for (let i = 0; i < this.routes.length; i++) {
            route = this.routes[i];

            if (route.isMatch(ctx)) {
                routeData = route.getRouteData(ctx);
                break;
            }
        }

        if (route == null) {
            return null;
        }


        if (console && console.log) {
            console.log(`Route not found for "${url}"`);
        }

        var targetType = this.routeTargets.get(route);
        if (!targetType){
            console.log('failed to find target for ', route);
            return null;
        }

        return {
            pageType: targetType,
            routeData
        };
    }
}