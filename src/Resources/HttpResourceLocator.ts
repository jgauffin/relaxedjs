import { IResourceLocator } from "../SPA/IResourceLocator";

// interface IResourceCache{
//     modifiedAt: Date;
//     content: string;
// }

export class HttpResourceLocator implements IResourceLocator{
    // private documents: IDictionary<IResourceCache>;
    // private scripts: IDictionary<IResourceCache>;

    async getHtml(section: string): Promise<string> {
        let path = window.location.pathname;
        if (window.location.pathname.indexOf(".") > -1) {
            const pos = window.location.pathname.lastIndexOf("/");
            path = window.location.pathname.substr(0, pos);
        }
        if (path.substring(-1, 1) === "/") {
            path = path.substring(0, -1);
        }

        return path + `/Views/${section}.html`;
    }

    async getScript(section: string): Promise<string> {
        let path = window.location.pathname;
        if (window.location.pathname.indexOf(".") > -1) {
            const pos = window.location.pathname.lastIndexOf("/");
            path = window.location.pathname.substr(0, pos);
        }
        if (path.substring(-1, 1) === "/") {
            path = path.substring(0, -1);
        }

        return path + `/ViewModels/${section}ViewModel.js`;
    }
}
