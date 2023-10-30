import { IRoute } from "../IRoute";
import { IRouteContext } from "../IRouteContext";

/**
 * A route is used to match the given url with a specific resource.
 *
 * Parameters in routes should be prefixed with ':' for strings and '+' to numbers (which will then be converted).
 */
export class Route implements IRoute {
    private parts: string[] = [];

    /**
     * 
     * @param route Url path, see class documentation for format.
     * @param routeTarget Panel to render in. Default if not specified. 
     */
    constructor(public route: string, public routeTarget?: string) {
        route = route.replace(/^\/|\/$/g, '');
        this.parts = route.replace(/^\//, "")
            .replace(/\/$/, "")
            .split("/");
    }

    isMatch(ctx: IRouteContext): boolean {
        const ctxUrl = ctx.url.replace(/^\/|\/$/g, '');
        const urlParts = ctxUrl.split("/", 10);
        for (let i = 0; i < this.parts.length; i++) {
            const myPart = this.parts[i];
            const pathPart = urlParts[i];
            if (pathPart !== undefined) {
                if (myPart.charAt(0) === ":" || myPart.charAt(0) == '+') {
                    continue;
                } else if (myPart !== pathPart) {
                    return false;
                }
            } else if (myPart.charAt(0) !== ":" || myPart.charAt(0) !== "+") {
                //not an argument, i.e not optional
            } else {
                return false;
            }
        }

        return true;
    }

    getRouteData(ctx: IRouteContext): any {
        const ctxUrl = ctx.url.replace(/^\/|\/$/g, '');
        const urlParts = ctxUrl.split("/", 10);
        const routeData: any = {};
        for (let i = 0; i < this.parts.length; i++) {
            const myPart = this.parts[i];
            const pathPart = urlParts[i];
            if (pathPart !== "undefined") {
                if (myPart.charAt(0) === ":") {
                    routeData[myPart.substring(1)] = pathPart;
                }
                if (myPart.charAt(0) === "+") {
                    routeData[myPart.substring(1)] = +pathPart;
                }
            } else if (myPart.charAt(0) === ":" || myPart.charAt(0) == '+') {
                routeData[myPart.substring(1)] = null;
            }
        }

        return routeData;
    }
}