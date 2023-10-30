   /**
 * Used when views (html) and view models (js) should be loaded.
 * Default implementation fetches them from the server.
 */
    export interface IResourceLocator {
        getHtml(section: string): Promise<string>;
        getScript(section: string): Promise<string>;
    }
