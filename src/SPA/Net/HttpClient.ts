import { IDictionary } from "../../Utils/IDictionary";
import { IHttpResponse } from "./interfaces/IHttpResponse";


export class HttpClient {
    async request(url: string, options?: RequestInit): Promise<IHttpResponse> {
        var token = localStorage.getItem('jwt');
        if (token && options) {
            const headers = options?.headers ? new Headers(options.headers) : new Headers();
            headers.set("Authorization", "Bearer " + token);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            return {
                statusCode: response.status,
                statusReason: response.statusText,
                success: false,
                contentType: response.headers.get('content-type'),
                body: await response.text(),
                charset: response.headers.get('charset'),

                as() {
                    throw new Error("No response received");
                }
            }
        }

        var body: any = null;
        if (response.status !== 204) {
            body = await response.json();
        }

        return {
            success: true,
            statusCode: response.status,
            statusReason: response.statusText,
            contentType: response.headers.get('content-type'),
            body: body,
            charset: response.headers.get('charset'),
            as<T>() {
                return <T>body;
            }
        };
    }


    async get(url: string, queryString?: IDictionary<string>, options?: RequestInit): Promise<IHttpResponse> {
        if (!options) {
            options = {
                method: 'GET',
                headers: { 'content-type': 'application/json' }
            }
        } else {
            options.method = 'GET';
        }

        if (queryString) {
            var prefix = '&';
            if (url.indexOf('?') === -1) {
                prefix = '?';
            }

            for (let key in queryString) {
                const value = queryString[key];
                url += `${prefix}${key}=${value}`;
                prefix = '&';

            }
        }

        return this.request(url, options);
    }

    async post(url: string, data: BodyInit, options?: RequestInit): Promise<IHttpResponse> {
        if (!options) {
            options = {
                method: 'POST',
                body: data,
                headers: { 'content-type': 'application/json' }
            }
        } else {
            options.method = 'POST';
            options.body = data;
        }

        return this.request(url, options);
    }

    async delete(url: string, options?: RequestInit): Promise<IHttpResponse> {
        if (!options) {
            options = {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' }
            }
        } else {
            options.method = 'DELETE';
        }

        return this.request(url, options);
    }
}
