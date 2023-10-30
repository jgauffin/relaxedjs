import {IRoute } from "./IRoute";
import { IViewTarget } from "./IViewTarget";

/**
 * Context used once a specific route has been selected by the routing engine.
 */
export interface IRouteExecutionContext {
    /**
     * Any parameters mapped in the route.
     * 
     * There can for instance be a property named "id" if the route is "/user/{id}";
     */
    routeData: any;

    /**
     * Route selected by the engine.
     */
    route: IRoute;

    /**
     * Target that the view should be rendered to.
     */
    target?: IViewTarget;
};
