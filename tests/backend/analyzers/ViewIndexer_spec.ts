import {ViewIndexAnalyzer} from "../../../src/Backend/Analyzers/ViewIndexer";
import { IComponentMeta } from "../../../src/Backend/Services/MetaGenerator";

describe("ViewIndexer", () => {
    const firstComponent: IComponentMeta={
        className: 'SomeComponent',
        constructorArguments: [{name: 'service', typeName: 'SomeService'}],
        data: [{name: 'userId', typeName: 'number', properties: []}],
        directory: __dirname+ '/files/',
        fileName: 'SomeComponent.ts',
        methods: [{name: 'OnSubmit', arguments: [{name: 'event', typeName: 'MouseEvent'}]}],
        properties: [{name: 'userId', typeName: 'number'}],
        tagName: 'some',
        routePath: '/'
    };

    test("that existing view is mapped.", async () => {
        const meta: IComponentMeta[] = [firstComponent];
        const errors: string[] = [];
       
        const sut = new ViewIndexAnalyzer();
        const index = await sut.generateIndex(meta, errors)

        expect(index[0]).toHaveProperty('viewPath');
    });

    test("that missing view is not mapped.", async () => {
        const meta: IComponentMeta[] = [{
            className: 'SomeComponent',
            constructorArguments: [{name: 'service', typeName: 'SomeService'}],
            data: [{name: 'userId', typeName: 'number', properties: []}],
            directory: __dirname+ '/',
            fileName: 'SomeComponent.ts',
            methods: [{name: 'OnSubmit', arguments: [{name: 'event', typeName: 'MouseEvent'}]}],
            properties: [{name: 'userId', typeName: 'number'}],
            tagName: 'some',
            routePath: '/'
        }];
        const errors: string[] = [];
       
        const sut = new ViewIndexAnalyzer();
        const index = await sut.generateIndex(meta, errors)

        expect(index[0]).not.toHaveProperty('viewPath');
    });
});