import { IInjection } from "./IInjection"

export function inject(key: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        const injection: IInjection = { index: parameterIndex, key }
        const existingInjections: IInjection[] = (target as any).injections || []
        console.log('key', propertyKey);
        
        Object.defineProperty(target, "injections", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: [...existingInjections, injection]
        })
    }
}