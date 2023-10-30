import {IRouteContext} from "./IRouteContext";

export interface IRoute {
    /**
 * Is the URL in the context matching this route?
 * @param ctx information used for matching
 */
    isMatch(ctx: IRouteContext): boolean;

    /**
 * Invoke this route.
 * @param ctx route information
 * @returns Data picked up from the url.
 */
    getRouteData(ctx: IRouteContext): any;
}