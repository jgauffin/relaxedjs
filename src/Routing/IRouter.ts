import { IComponent as IPage } from "../Components/IComponent";
import { PageType } from "./Implementation/Router";
import { IRoute } from "./IRoute";

/**
 * Reponsible of matching URLs against all registered routes.
 */
export interface IRouter{
   /**
     * Route an URL
     * @param urlPattern URL pattern to act on (@see Route for format description).
     * @param pageType Page to create and invoke when the route matches.
     * @param outputTarget id of route panel to render in.
     */
    mapRoute(urlPattern: string, pageType: PageType, outputTarget?: string):void;

    /**
     * Add a custom implmentation of IRoute.
     * @param route route to match.
     * @param pageType Page to create and invoke when the route matches.
     */

    mapCustomRoute(route: IRoute, pageType: PageType): void;

        /**
     * Match browser url against all given routes.
     * @param url URL to match
     * @returns Page if route is matched; otherwise `null`.
     */

    match(url: string): IPage | null;
}