import { IArgumentMeta, IComponentMeta, IFunctionMeta, IPropertyMeta } from "../../../src/Backend/Services/MetaGenerator";

export class FakeComponentMeta implements IComponentMeta {
    findMethod(name: string): IFunctionMeta|undefined {
        return this.functions.find(x=>x.name == name);
    }

    tagName: string = '';
    routePath?: string | undefined;
    data: IPropertyMeta[] = [];
    className: string = '';
    fileName: string = '';
    directory: string = '';
    functions: IFunctionMeta[] = [];
    constructorArguments: IArgumentMeta[] = [];
    properties: IArgumentMeta[] = [];

    setData(data: any) {
        this.buildMeta(data, item => this.data.push(item));
    }

    private buildMeta(data: any, addMethod: (prop: IPropertyMeta) => void) {
        for (var key in data) {
            console.log('ooking', key);
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            var item = data[key];
            if (!item){
                continue;
            }

            var prop: IPropertyMeta = {
                name: key,
                properties: [],
                typeName: typeof item
            };
            addMethod(prop);

            if (typeof prop.typeName == 'object') {
                this.buildMeta(item, child => prop.properties.push(child));
            }
        }
    }
}